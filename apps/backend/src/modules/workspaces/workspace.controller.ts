import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { WorkspacesApiPath } from "./libs/enums/enums.js";
import { type WorkspaceCreateRequestDto } from "./libs/types/types.js";
import {
	workspaceCreationValidationSchema,
	workspaceGetByQueryValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
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
			handler: (options) =>
				this.findAllByUserId(
					options as APIHandlerOptions<{
						query: { workspaceName?: string };
					}>,
				),
			method: HTTPMethod.GET,
			path: WorkspacesApiPath.ROOT,
			validation: {
				query: workspaceGetByQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: WorkspaceCreateRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: WorkspacesApiPath.ROOT,
			validation: {
				body: workspaceCreationValidationSchema,
			},
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
	 *        409:
	 *          description: Workspace name already exists
	 */
	private async create(
		options: APIHandlerOptions<{
			body: WorkspaceCreateRequestDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.create({
				...options.body,
				userId: options.user?.id as number,
			}),
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
	 *      parameters:
	 *        - in: query
	 *          name: workspaceName
	 *          schema:
	 *            type: string
	 *          description: Search term to filter workspaces by name
	 *      responses:
	 */
	private async findAllByUserId(
		options: APIHandlerOptions<{
			query: { workspaceName?: string };
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.findAllByUserId(
				options.user?.id as number,
				options.query.workspaceName,
			),
			status: HTTPCode.OK,
		};
	}
}

export { WorkspaceController };
