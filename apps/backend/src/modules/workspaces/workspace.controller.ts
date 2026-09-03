import { APIPath } from "~/libs/enums/enums.js";
import {
	APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { WorkspacesApiPath } from "./libs/enums/enums.js";
import {
	type WorkspaceCreateRequestDto,
	type WorkspaceRouteParametersDto,
	type WorkspaceUpdateRequestDto,
} from "./libs/types/types.js";
import {
	workspaceCreationValidationSchema,
	workspaceRouteParametersValidationSchema,
	workspaceUpdateValidationSchema,
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
				this.findAllUserWorkspaces(
					options as APIHandlerOptions<{
						query: { search?: string };
					}>,
				),
			method: HTTPMethod.GET,
			path: WorkspacesApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) => this.create(options),
			method: HTTPMethod.POST,
			path: WorkspacesApiPath.ROOT,
			validation: {
				body: workspaceCreationValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.update(
					options as APIHandlerOptions<{
						body: WorkspaceUpdateRequestDto;
						params: WorkspaceRouteParametersDto;
					}>,
				),
			method: HTTPMethod.PATCH,
			path: WorkspacesApiPath.ID,
			validation: {
				body: workspaceUpdateValidationSchema,
				params: workspaceRouteParametersValidationSchema,
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
	 */
	private async create(options: APIHandlerOptions) {
		return {
			payload: await this.workspaceService.create({
				...(options.body as WorkspaceCreateRequestDto),
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
		options: APIHandlerOptions<{
			query: { search?: string };
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.findAllUserWorkspaces(
				options.user?.id as number,
				options.query.search,
			),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /workspaces/{id}:
	 *   patch:
	 *     description: Updates an owned workspace
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             additionalProperties: false
	 *             minProperties: 1
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 minLength: 3
	 *                 maxLength: 50
	 *               stackTags:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *     responses:
	 *       200:
	 *         description: Workspace updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Workspace"
	 *       404:
	 *         description: Workspace not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       409:
	 *         description: Workspace with this name already exists
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */

	private async update(
		options: APIHandlerOptions<{
			body: WorkspaceUpdateRequestDto;
			params: WorkspaceRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.update(
				options.params.id,
				options.body,
				options.user?.id as number,
			),
			status: HTTPCode.OK,
		};
	}
}

export { WorkspaceController };
