import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type MembershipService } from "~/modules/memberships/membership.service.js";

import { WorkspacesApiPath } from "./libs/enums/enums.js";
import { createWorkspaceAccessHook } from "./libs/hooks/workspace-access.hook.js";
import {
	type WorkspaceAddMemberRequestDto,
	type WorkspaceCreateRequestDto,
	type WorkspaceGetAllRequestDto,
} from "./libs/types/types.js";
import {
	workspaceAddMemberValidationSchema,
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
	private membershipService: MembershipService;

	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		membershipService: MembershipService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.WORKSPACES);

		this.membershipService = membershipService;
		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.addMember(
					options as APIHandlerOptions<{
						body: WorkspaceAddMemberRequestDto;
						params: { id: string };
					}>,
				),
			method: HTTPMethod.POST,
			path: WorkspacesApiPath.WORKSPACE_MEMBERSHIPS,
			preHandler: createWorkspaceAccessHook(this.membershipService),
			validation: {
				body: workspaceAddMemberValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.removeMember(
					options as APIHandlerOptions<{
						params: { id: string; userId: string };
					}>,
				),
			method: HTTPMethod.DELETE,
			path: WorkspacesApiPath.WORKSPACE_MEMBERSHIP,
			preHandler: createWorkspaceAccessHook(this.membershipService),
		});

		this.addRoute({
			handler: (options) =>
				this.findAllByUserId(
					options as APIHandlerOptions<{
						query: WorkspaceGetAllRequestDto;
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
	private async addMember(
		options: APIHandlerOptions<{
			body: WorkspaceAddMemberRequestDto;
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.workspaceService.addMember(
				options.user?.id as number,
				Number(options.params.id),
				options.body.userId,
			),
			status: HTTPCode.CREATED,
		};
	}

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
	 *         200:
	 *           description: Successful operation
	 *           content:
	 *             application/json:
	 *               schema:
	 *                 type: object
	 *                 properties:
	 *                   items:
	 *                     type: array
	 *                     items:
	 *                       $ref: "#/components/schemas/Workspace"
	 */
	private async findAllByUserId(
		options: APIHandlerOptions<{
			query: WorkspaceGetAllRequestDto;
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

	private async removeMember(
		options: APIHandlerOptions<{
			params: { id: string; userId: string };
		}>,
	): Promise<APIHandlerResponse> {
		await this.workspaceService.removeMember(
			options.user?.id as number,
			Number(options.params.id),
			Number(options.params.userId),
		);

		return {
			payload: null,
			status: HTTPCode.NO_CONTENT,
		};
	}
}

export { WorkspaceController };
