import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { WorkspacesApiPath } from "../workspaces/libs/enums/enums.js";
import { workspaceAccessHook } from "../workspaces/libs/hooks/workspace-access.hook.js";
import { workspaceContributorDeleteAccessHook } from "../workspaces/libs/hooks/workspace-contributor-delete-access.hook.js";
import { workspaceOwnerAccessHook } from "../workspaces/libs/hooks/workspace-owner-access.hook.js";
import {
	type WorkspaceAddContributorRequestDto,
	type WorkspaceContributorCandidatesQueryDto,
	type WorkspaceContributorRouteParametersDto,
	type WorkspaceRouteParametersDto,
} from "../workspaces/libs/types/types.js";
import {
	workspaceAddContributorValidationSchema,
	workspaceContributorCandidatesQueryValidationSchema,
	workspaceContributorRouteParametersValidationSchema,
	workspaceRouteParametersValidationSchema,
} from "../workspaces/libs/validation-schemas/validation-schemas.js";
import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { type ContributorService } from "./contributor.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Contributor:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - workspaceId
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *         userId:
 *           type: integer
 *           minimum: 1
 *         workspaceId:
 *           type: integer
 *           minimum: 1
 *     WorkspaceUserSummary:
 *       type: object
 *       required:
 *         - email
 *         - id
 *         - nickname
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         id:
 *           type: integer
 *           minimum: 1
 *         nickname:
 *           type: string
 *     WorkspaceContributorCandidatesResponse:
 *       type: object
 *       required:
 *         - items
 *         - nextCursor
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/WorkspaceUserSummary"
 *         nextCursor:
 *           type: string
 *           nullable: true
 *           description: Opaque cursor for loading the next page
 *     WorkspaceContributorsResponse:
 *       type: object
 *       required:
 *         - contributors
 *         - owner
 *       properties:
 *         contributors:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/WorkspaceUserSummary"
 *         owner:
 *           $ref: "#/components/schemas/WorkspaceUserSummary"
 */
class ContributorController extends BaseController {
	private contributorService: ContributorService;

	public constructor(
		logger: Logger,
		contributorService: ContributorService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.WORKSPACES);

		this.contributorService = contributorService;

		this.addRoute({
			handler: (options) =>
				this.delete(
					options as APIHandlerOptions<{
						params: WorkspaceContributorRouteParametersDto;
					}>,
				),
			method: HTTPMethod.DELETE,
			path: WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS_USER_ID,
			preHandler: workspaceContributorDeleteAccessHook(workspaceService),
			validation: {
				params: workspaceContributorRouteParametersValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findCandidates(
					options as APIHandlerOptions<{
						params: WorkspaceRouteParametersDto;
						query: WorkspaceContributorCandidatesQueryDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTOR_CANDIDATES,
			preHandler: workspaceOwnerAccessHook(workspaceService),
			validation: {
				params: workspaceRouteParametersValidationSchema,
				query: workspaceContributorCandidatesQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findAllByWorkspaceId(
					options as APIHandlerOptions<{
						params: WorkspaceRouteParametersDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS,
			preHandler: workspaceAccessHook(workspaceService),
			validation: {
				params: workspaceRouteParametersValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: WorkspaceAddContributorRequestDto;
						params: WorkspaceRouteParametersDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS,
			preHandler: workspaceOwnerAccessHook(workspaceService),
			validation: {
				body: workspaceAddContributorValidationSchema,
				params: workspaceRouteParametersValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /workspaces/{workspaceId}/contributors:
	 *   post:
	 *     description: Adds an existing user as a workspace contributor
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: workspaceId
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
	 *             required:
	 *               - userId
	 *             properties:
	 *               userId:
	 *                 type: integer
	 *                 minimum: 1
	 *     responses:
	 *       201:
	 *         description: Contributor added successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Contributor"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       403:
	 *         description: Only the workspace owner can add contributors
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       404:
	 *         description: Workspace or target user not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       409:
	 *         description: User is already a contributor or is the workspace owner
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Invalid route parameters or request body
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */

	private async create(
		options: APIHandlerOptions<{
			body: WorkspaceAddContributorRequestDto;
			params: WorkspaceRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.contributorService.add(
				{
					...options.body,
					workspaceId: options.params.workspaceId,
				},
				options.user?.id as number,
			),
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /workspaces/{workspaceId}/contributors/{userId}:
	 *   delete:
	 *     description: Removes a contributor or leaves a workspace
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: workspaceId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *       - in: path
	 *         name: userId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *     responses:
	 *       204:
	 *         description: Contributor removed successfully
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       403:
	 *         description: The action is forbidden or the workspace owner was targeted
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       404:
	 *         description: Workspace or contributor not found, or the user does not have access
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Invalid route parameters
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */

	private async delete(
		options: APIHandlerOptions<{
			params: WorkspaceContributorRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		await this.contributorService.remove(
			options.params.workspaceId,
			options.params.userId,
		);

		return {
			payload: null,
			status: HTTPCode.NO_CONTENT,
		};
	}

	/**
	 * @swagger
	 * /workspaces/{workspaceId}/contributors:
	 *   get:
	 *     description: Returns the workspace owner and contributors
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: workspaceId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *     responses:
	 *       200:
	 *         description: Workspace contributors returned successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/WorkspaceContributorsResponse"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       404:
	 *         description: Workspace not found or the user does not have access
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Invalid workspace identifier
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */

	private async findAllByWorkspaceId(
		options: APIHandlerOptions<{
			params: WorkspaceRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.contributorService.findAllByWorkspaceId(
				options.params.workspaceId,
			),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /workspaces/{workspaceId}/contributor-candidates:
	 *   get:
	 *     description: Returns users who can be added as workspace contributors
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: workspaceId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *       - in: query
	 *         name: userQuery
	 *         required: false
	 *         description: Filters users by nickname or email
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: cursor
	 *         required: false
	 *         description: Opaque cursor returned by the previous response
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Contributor candidates returned successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/WorkspaceContributorCandidatesResponse"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       403:
	 *         description: Only the workspace owner can view contributor candidates
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       404:
	 *         description: Workspace not found or the user does not have access
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Invalid workspace identifier, query, or cursor
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */

	private async findCandidates(
		options: APIHandlerOptions<{
			params: WorkspaceRouteParametersDto;
			query: WorkspaceContributorCandidatesQueryDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.contributorService.findCandidates(
				options.params.workspaceId,
				options.user?.id as number,
				options.query,
			),
			status: HTTPCode.OK,
		};
	}
}

export { ContributorController };
