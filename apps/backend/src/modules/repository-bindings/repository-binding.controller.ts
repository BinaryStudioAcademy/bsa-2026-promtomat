import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserDto } from "~/libs/types/types.js";

import { workspaceAccessHook } from "../workspaces/libs/hooks/workspace-access.hook.js";
import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { RepositoryBindingsApiPath } from "./libs/enums/enums.js";
import {
	type CreateRepositoryBindingRequestDto,
	type ResolveRepositoryBindingQueryDto,
} from "./libs/types/types.js";
import {
	createRepositoryBinding,
	resolveRepositoryBindingQuery,
} from "./libs/validation-schemas/validation-schemas.js";
import { type RepositoryBindingService } from "./repository-binding.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     RepositoryBinding:
 *       type: object
 *       required:
 *         - host
 *         - id
 *         - owner
 *         - repo
 *         - workspaceId
 *       properties:
 *         host:
 *           type: string
 *         id:
 *           type: integer
 *           minimum: 1
 *         owner:
 *           type: string
 *         repo:
 *           type: string
 *         workspaceId:
 *           type: integer
 *           minimum: 1
 *     RepositoryBindingResolution:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - ambiguous
 *             - resolved
 *             - unresolved
 *         workspaceId:
 *           type: integer
 *           minimum: 1
 *         workspaces:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: integer
 *                 minimum: 1
 *               name:
 *                 type: string
 */
class RepositoryBindingController extends BaseController {
	private repositoryBindingService: RepositoryBindingService;

	public constructor(
		logger: Logger,
		repositoryBindingService: RepositoryBindingService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.REPOSITORY_BINDINGS);

		this.repositoryBindingService = repositoryBindingService;

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: CreateRepositoryBindingRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: RepositoryBindingsApiPath.ROOT,
			preHandler: workspaceAccessHook(workspaceService),
			validation: {
				body: createRepositoryBinding,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.resolve(
					options as APIHandlerOptions<{
						query: ResolveRepositoryBindingQueryDto;
					}> & { user: UserDto },
				),
			method: HTTPMethod.GET,
			path: RepositoryBindingsApiPath.RESOLVE,
			validation: {
				query: resolveRepositoryBindingQuery,
			},
		});
	}

	/**
	 * @swagger
	 * /repository-bindings:
	 *   post:
	 *     description: Binds a repository identity to a workspace
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - remoteUrl
	 *               - workspaceId
	 *             properties:
	 *               remoteUrl:
	 *                 type: string
	 *               workspaceId:
	 *                 type: integer
	 *                 minimum: 1
	 *     responses:
	 *       201:
	 *         description: Repository binding created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/RepositoryBinding"
	 *       401:
	 *         description: Unauthorized
	 *       404:
	 *         description: Workspace not found or the user does not have access
	 *       409:
	 *         description: This repository is already bound to this workspace
	 *       422:
	 *         description: Invalid request body or unrecognized remote URL
	 */
	private async create(
		options: APIHandlerOptions<{
			body: CreateRepositoryBindingRequestDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.repositoryBindingService.create(options.body),
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /repository-bindings/resolve:
	 *   get:
	 *     description: Resolves a repository identity to the accessible workspace it is bound to
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: remoteUrl
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Resolution computed successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/RepositoryBindingResolution"
	 *       401:
	 *         description: Unauthorized
	 *       422:
	 *         description: Invalid query or unrecognized remote URL
	 */
	private async resolve(
		options: APIHandlerOptions<{
			query: ResolveRepositoryBindingQueryDto;
		}> & { user: UserDto },
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.repositoryBindingService.resolve(
				options.query,
				options.user.id,
			),
			status: HTTPCode.OK,
		};
	}
}

export { RepositoryBindingController };
