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
import {
	type WorkspaceAddContributorRequestDto,
	type WorkspaceRouteParametersDto,
} from "../workspaces/libs/types/types.js";
import {
	workspaceAddContributorValidationSchema,
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
				this.create(
					options as APIHandlerOptions<{
						body: WorkspaceAddContributorRequestDto;
						params: WorkspaceRouteParametersDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: WorkspacesApiPath.$WORKSPACE_ID_CONTRIBUTORS,
			preHandler: workspaceAccessHook(workspaceService),
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
	 *       403:
	 *         description: Only the workspace owner can add contributors
	 *       404:
	 *         description: Workspace or target user not found
	 *       409:
	 *         description: User is already a contributor or is the workspace owner
	 *       422:
	 *         description: Invalid route parameters or request body
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
}

export { ContributorController };
