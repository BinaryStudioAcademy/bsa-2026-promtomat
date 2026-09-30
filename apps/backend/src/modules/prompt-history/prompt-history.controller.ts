import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { workspaceAccessHook } from "~/modules/workspaces/libs/hooks/workspace-access.hook.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { PromptHistoryApiPath } from "./libs/enums/enums.js";
import { type PromptHistoryGetQueryDto } from "./libs/types/types.js";
import { promptHistoryGetQueryValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
import { type PromptHistoryService } from "./prompt-history.service.js";

/**
 * @swagger
 * components:
 *    schemas:
 *      PromptHistoryItem:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          body:
 *            type: string
 *          intent:
 *            type: string
 *          score:
 *            type: number
 *          computedScore:
 *            type: number
 *            nullable: true
 *          isComposed:
 *            type: boolean
 *          userId:
 *            type: number
 *          workspaceId:
 *            type: number
 *          workspaceName:
 *            type: string
 *          createdAt:
 *            type: string
 *            format: date-time
 *      PromptHistoryGetAllResponse:
 *        type: object
 *        properties:
 *          items:
 *            type: array
 *            items:
 *              $ref: "#/components/schemas/PromptHistoryItem"
 *          page:
 *            type: number
 *          pageSize:
 *            type: number
 *          totalCount:
 *            type: number
 *          averageScore:
 *            type: number
 *            nullable: true
 */
class PromptHistoryController extends BaseController {
	private promptHistoryService: PromptHistoryService;

	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		promptHistoryService: PromptHistoryService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.PROMPT_HISTORY);

		this.promptHistoryService = promptHistoryService;
		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.findAll(
					options as APIHandlerOptions<{ query: PromptHistoryGetQueryDto }>,
				),
			method: HTTPMethod.GET,
			path: PromptHistoryApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				query: promptHistoryGetQueryValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /prompt-history:
	 *    get:
	 *      description: >
	 *        Returns a unified, paginated feed of training prompts and composed prompts for a workspace
	 *        accessible to the caller, sorted by creation date
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: query
	 *          name: workspaceId
	 *          required: true
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *        - in: query
	 *          name: search
	 *          schema:
	 *            type: string
	 *        - in: query
	 *          name: qualityTier
	 *          schema:
	 *            type: string
	 *        - in: query
	 *          name: page
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *            default: 1
	 *        - in: query
	 *          name: limit
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *            maximum: 100
	 *            default: 10
	 *      responses:
	 *        200:
	 *          description: Unified prompt history successfully retrieved
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/PromptHistoryGetAllResponse"
	 *        401:
	 *          description: Unauthorized
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Error"
	 *        404:
	 *          description: Workspace not found
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Error"
	 *        422:
	 *          description: Validation failed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/ValidationError"
	 */
	private async findAll(
		options: APIHandlerOptions<{ query: PromptHistoryGetQueryDto }>,
	): Promise<APIHandlerResponse> {
		const result = await this.promptHistoryService.findAll(
			options.query,
			options.user?.id as number,
		);

		return {
			payload: result,
			status: HTTPCode.OK,
		};
	}
}

export { PromptHistoryController };
