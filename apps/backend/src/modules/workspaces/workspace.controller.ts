import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
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
	workspaceGetByQueryValidationSchema,
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
				this.findDeletionImpact(
					options as APIHandlerOptions<{
						params: WorkspaceRouteParametersDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: WorkspacesApiPath.DELETION_IMPACT,
			validation: {
				params: workspaceRouteParametersValidationSchema,
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

		this.addRoute({
			handler: (options) =>
				this.delete(
					options as APIHandlerOptions<{
						params: WorkspaceRouteParametersDto;
					}>,
				),
			method: HTTPMethod.DELETE,
			path: WorkspacesApiPath.ID,
			validation: {
				params: workspaceRouteParametersValidationSchema,
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

	private async delete(
		options: APIHandlerOptions<{
			params: WorkspaceRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		await this.workspaceService.delete(
			options.params.id,
			options.user?.id as number,
		);

		return {
			payload: null,
			status: HTTPCode.NO_CONTENT,
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

	/**
	 * @swagger
	 * /workspaces/{id}/deletion-impact:
	 *   get:
	 *     description: Returns the deletion impact for an owned workspace
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *     responses:
	 *       200:
	 *         description: Workspace deletion impact returned successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               required:
	 *                 - canDelete
	 *                 - promptCount
	 *               properties:
	 *                 canDelete:
	 *                   type: boolean
	 *                 promptCount:
	 *                   type: integer
	 *                   minimum: 0
	 *       404:
	 *         description: Workspace not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Invalid workspace id
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */

	private async findDeletionImpact(
		options: APIHandlerOptions<{
			params: WorkspaceRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.findDeletionImpact(
				options.params.id,
				options.user?.id as number,
			),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /workspaces/{id}:
	 *   delete:
	 *     description: Deletes an owned workspace
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *     responses:
	 *       204:
	 *         description: Workspace deleted successfully
	 *       404:
	 *         description: Workspace not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       409:
	 *         description: The last owned workspace cannot be deleted
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Invalid workspace id
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
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
