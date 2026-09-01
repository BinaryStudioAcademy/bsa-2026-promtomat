import { APIPath } from "~/libs/enums/enums.js";
import {
	APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { WorkspacesApiPath } from "./libs/enums/enums.js";
import { type WorkspaceCreateRequestDto } from "./libs/types/types.js";
import { type WorkspaceService } from "./workspace.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           minimum: 1
 *         name:
 *           type: string
 *         stackTags:
 *           type: array
 *           items:
 *             type: string
 *         userId:
 *           type: number
 *         visibility:
 *           type: string
 */
class WorkspaceController extends BaseController {
	private workspaceService: WorkspaceService;

	public constructor(logger: Logger, workspaceService: WorkspaceService) {
		super(logger, APIPath.WORKSPACES);

		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) => this.findAllUserWorkspaces(options),
			method: HTTPMethod.GET,
			path: WorkspacesApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) => this.create(options),
			method: HTTPMethod.POST,
			path: WorkspacesApiPath.ROOT,
		});
	}

	/**
	 * @swagger
	 * /workspaces:
	 *    post:
	 *      description: Creates a new workspace
	 *      security:
	 *        - bearerAuth: []
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                name:
	 *                  type: string
	 *                stackTags:
	 *                  type: array
	 *                  items:
	 *                    type: string
	 *                visibility:
	 *                  type: string
	 *      responses:
	 *        201:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Workspace"
	 */
	private async create(options: APIHandlerOptions) {
		return {
			payload: await this.workspaceService.create(
				options.body as WorkspaceCreateRequestDto,
				options.user?.id as number,
			),
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /workspaces:
	 *    get:
	 *      description: Returns an array of user's workspaces
	 *      security:
	 *        - bearerAuth: []
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: array
	 *                items:
	 *                  $ref: "#/components/schemas/Workspace"
	 */
	private async findAllUserWorkspaces(
		options: APIHandlerOptions,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.findAllUserWorkspaces(
				options.user?.id as number,
				(options.query as { search?: string }).search,
			),
			status: HTTPCode.OK,
		};
	}
}

export { WorkspaceController };
