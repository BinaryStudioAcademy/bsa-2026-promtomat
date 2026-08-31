import fastifyStatic from "@fastify/static";
import swagger, { type StaticDocumentSpec } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ErrorCode } from "~/libs/enums/enums.js";
import { type ValidationError } from "~/libs/exceptions/exceptions.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type Database } from "~/libs/modules/database/database.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type ServerCommonErrorResponse,
	type ServerValidationErrorResponse,
	type ValidationSchema,
} from "~/libs/types/types.js";

import { AuthGuard, authGuardPlugin } from "../auth-guard/auth-guard.js";
import {
	type ServerApplication,
	type ServerApplicationApi,
	type ServerApplicationRouteParameters,
} from "./libs/types/types.js";

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"] as const;

const SHUTDOWN_TIMEOUT_MS = 10_000;

const SHUTDOWN_FAILURE_EXIT_CODE = 1;

type Constructor = {
	apis: ServerApplicationApi[];
	authGuard: AuthGuard;
	config: Config;
	database: Database;
	logger: Logger;
	title: string;
};

class BaseServerApplication implements ServerApplication {
	private apis: ServerApplicationApi[];

	private app!: FastifyInstance;

	private authGuard: AuthGuard;

	private config: Config;

	private database: Database;

	private logger: Logger;

	private title: string;

	public constructor({
		apis,
		authGuard,
		config,
		database,
		logger,
		title,
	}: Constructor) {
		this.title = title;
		this.authGuard = authGuard;
		this.config = config;
		this.logger = logger;
		this.database = database;
		this.apis = apis;

		this.initApp();
	}

	private initApp(): void {
		this.app = Fastify({
			ignoreTrailingSlash: true,
		});
	}

	private initDatabaseLifecycle(): void {
		this.app.addHook("onClose", async () => {
			await this.database.disconnect();
		});
	}

	private initErrorHandler(): void {
		this.app.setErrorHandler(
			(error: FastifyError | ValidationError, _request, reply) => {
				if ("issues" in error) {
					this.logger.error(`[Validation Error]: ${error.message}`);

					for (let issue of error.issues) {
						this.logger.error(`[${issue.path.toString()}] — ${issue.message}`);
					}

					const response: ServerValidationErrorResponse = {
						code: ErrorCode.VALIDATION_FAILED,
						details: error.issues.map((issue) => ({
							message: issue.message,
							path: issue.path.map((segment) => segment.toString()),
						})),
						message: error.message,
					};

					return reply.status(HTTPCode.UNPROCESSED_ENTITY).send(response);
				}

				if (error instanceof HTTPError) {
					this.logger.error(
						`[HTTP Error]: ${error.status.toString()} — ${error.message}`,
					);

					const response: ServerCommonErrorResponse = {
						code: ErrorCode.INTERNAL_SERVER_ERROR,
						message: error.message,
					};

					return reply.status(error.status).send(response);
				}

				this.logger.error(error.message);

				const response: ServerCommonErrorResponse = {
					code: ErrorCode.INTERNAL_SERVER_ERROR,
					message: error.message,
				};

				return reply.status(HTTPCode.INTERNAL_SERVER_ERROR).send(response);
			},
		);
	}

	private async initServe(): Promise<void> {
		const staticPath = path.join(
			path.dirname(fileURLToPath(import.meta.url)),
			"../../../../public",
		);

		await this.app.register(fastifyStatic, {
			prefix: "/",
			root: staticPath,
		});

		this.app.setNotFoundHandler(async (_request, response) => {
			await response.sendFile("index.html", staticPath);
		});
	}

	private initShutdown(): void {
		for (let signal of SHUTDOWN_SIGNALS) {
			process.once(signal, () => {
				void this.shutdown(signal);
			});
		}
	}

	private initValidationCompiler(): void {
		this.app.setValidatorCompiler<ValidationSchema>(({ schema }) => {
			return <T>(data: T): { value: ReturnType<ValidationSchema["parse"]> } => {
				return { value: schema.parse(data) };
			};
		});
	}

	private logError(error: unknown): void {
		if (error instanceof Error) {
			this.logger.error(error.message, {
				cause: error.cause,
				stack: error.stack,
			});

			return;
		}

		this.logger.error("Unknown error", { error });
	}

	private async shutdown(signal: string): Promise<void> {
		this.logger.info(`Received ${signal}, shutting down…`);

		const timeout = this.terminateAfterTimeout();

		try {
			await this.app.close();

			clearTimeout(timeout);
		} catch (error) {
			clearTimeout(timeout);

			this.logError(error);
			this.logger.flush();

			// eslint-disable-next-line unicorn/no-process-exit -- graceful shutdown must terminate the process
			process.exit(SHUTDOWN_FAILURE_EXIT_CODE);
		}
	}

	private terminateAfterTimeout(): ReturnType<typeof setTimeout> {
		return setTimeout(() => {
			this.logger.error(
				`Shutdown did not complete within ${SHUTDOWN_TIMEOUT_MS.toString()}ms, forcing exit`,
			);
			this.logger.flush();

			// eslint-disable-next-line unicorn/no-process-exit -- graceful shutdown must terminate the process
			process.exit(SHUTDOWN_FAILURE_EXIT_CODE);
		}, SHUTDOWN_TIMEOUT_MS).unref();
	}

	public addRoute(parameters: ServerApplicationRouteParameters): void {
		const { handler, method, path, validation } = parameters;

		this.app.route({
			handler,
			method,
			schema: {
				body: validation?.body,
			},
			url: path,
		});

		this.logger.info(`Route: ${method} ${path} is registered`);
	}

	public addRoutes(parameters: ServerApplicationRouteParameters[]): void {
		for (let parameter of parameters) {
			this.addRoute(parameter);
		}
	}

	public async init(): Promise<void> {
		this.logger.info("Application initialization…");

		await this.initServe();

		await this.initMiddlewares();

		await this.app.register(authGuardPlugin, { authGuard: this.authGuard });

		this.initValidationCompiler();

		this.initErrorHandler();

		this.initRoutes();

		this.initDatabaseLifecycle();

		this.database.connect();

		this.initShutdown();

		try {
			await this.app.listen({
				host: this.config.ENV.APP.HOST,
				port: this.config.ENV.APP.PORT,
			});

			this.logger.info(
				`Application is listening on PORT – ${this.config.ENV.APP.PORT.toString()}, on ENVIRONMENT – ${
					this.config.ENV.APP.ENVIRONMENT as string
				}.`,
			);
		} catch (error) {
			await this.app.close();

			this.logError(error);

			throw error;
		}
	}

	public async initMiddlewares(): Promise<void> {
		await Promise.all(
			this.apis.map(async (api) => {
				this.logger.info(
					`Generate swagger documentation for API ${api.version}`,
				);

				await this.app.register(swagger, {
					mode: "static",
					specification: {
						document: api.generateDoc(
							this.title,
						) as StaticDocumentSpec["document"],
					},
				});

				await this.app.register(swaggerUi, {
					routePrefix: `/${api.version}/documentation`,
				});
			}),
		);
	}

	public initRoutes(): void {
		const routers = this.apis.flatMap((api) => api.routes);

		this.addRoutes(routers);
	}
}

export { BaseServerApplication };
