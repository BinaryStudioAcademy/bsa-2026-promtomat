import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type ApiTokenRequestDto,
	type ApiTokenRouteParametersDto,
} from "~/libs/types/types.js";

import { type ApiTokenService } from "./api-token.service.js";
import { TokenApiPath } from "./libs/enums/enums.js";
import {
	tokenCreateValidationSchema,
	tokenRouteParametersValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";

class ApiTokenController extends BaseController {
	private apiTokenService: ApiTokenService;

	public constructor(logger: Logger, apiTokenService: ApiTokenService) {
		super(logger, APIPath.API_TOKENS);

		this.apiTokenService = apiTokenService;

		this.addRoute({
			handler: (options) => this.findAllByUserId(options),
			method: HTTPMethod.GET,
			path: TokenApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: ApiTokenRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: TokenApiPath.ROOT,
			validation: {
				body: tokenCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.revoke(
					options as APIHandlerOptions<{
						params: ApiTokenRouteParametersDto;
					}>,
				),
			method: HTTPMethod.DELETE,
			path: TokenApiPath.REVOKE,
			validation: {
				params: tokenRouteParametersValidationSchema,
			},
		});
	}

	private async create(
		options: APIHandlerOptions<{ body: ApiTokenRequestDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.apiTokenService.issue(
				options.body.name,
				options.user?.id as number,
			),
			status: HTTPCode.CREATED,
		};
	}

	private async findAllByUserId(
		options: APIHandlerOptions,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.apiTokenService.findAllByUserId(
				options.user?.id as number,
			),
			status: HTTPCode.OK,
		};
	}

	private async revoke(
		options: APIHandlerOptions<{ params: ApiTokenRouteParametersDto }>,
	): Promise<APIHandlerResponse> {
		await this.apiTokenService.delete(
			options.params.id,
			options.user?.id as number,
		);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}
}

export { ApiTokenController };
