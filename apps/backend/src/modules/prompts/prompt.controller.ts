import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { workspaceAccessHook } from "../workspaces/libs/hooks/workspace-access.hook.js";
import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { PromptsApiPath } from "./libs/enums/enums.js";
import {
	type GetPromptsRequestDto,
	type PromptCreateRequestDto,
} from "./libs/types/types.js";
import {
	promptCreateValidationSchema,
	promptGetByQueryValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type PromptService } from "./prompt.service.js";

/*** @swagger
 * components:
 *    schemas:
 *      Prompt:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            minimum: 1
 *          label:
 *            type: string
 *          efficiencyScore:
 *            type: number
 *            minimum: 1
 *            maximum: 10
 *          promptBody:
 *            type: string
 *          taskIntent:
 *            type: string
 *          userId:
 *            type: number
 *          workspaceId:
 *            type: number
 */
class PromptController extends BaseController {
	private promptService: PromptService;

	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		promptService: PromptService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.PROMPTS);

		this.promptService = promptService;

		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.findAllByWorkspace(
					options as APIHandlerOptions<{
						query: GetPromptsRequestDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				query: promptGetByQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: PromptCreateRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: PromptsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				body: promptCreateValidationSchema,
			},
		});
	}

	private async create(
		options: APIHandlerOptions<{ body: PromptCreateRequestDto }>,
	): Promise<APIHandlerResponse> {
		const payload = {
			...options.body,
			userId: options.user?.id as number,
		};
		return {
			payload: await this.promptService.create(payload),
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /prompts:
	 *    post:
	 *      description: Creates a new prompt
	 *      security:
	 *        - bearerAuth: []
	 *      requestBody:
	 *        description: Prompt data
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                efficiencyScore:
	 *                  type: number
	 *                  minimum: 1
	 *                  maximum: 10
	 *                promptBody:
	 *                  type: string
	 *                taskIntent:
	 *                  type: string
	 *                workspaceId:
	 *                  type: number
	 *      responses:
	 *        201:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Prompt"
	 *        401:
	 *          description: Unauthorized
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  errorType:
	 *                    type: string
	 *                  message:
	 *                    type: string
	 *        404:
	 *          description: Workspace not found
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  errorType:
	 *                    type: string
	 *                  message:
	 *                    type: string
	 *        422:
	 *          description: Validation failed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  details:
	 *                    type: array
	 *                    items:
	 *                      type: object
	 *                      properties:
	 *                        message:
	 *                          type: string
	 *                        path:
	 *                          type: array
	 *                          items:
	 *                            type: string
	 *                  errorType:
	 *                    type: string
	 *                  message:
	 *                    type: string
	 */
	/**
	 * @swagger
	 * /prompts:
	 *    get:
	 *      description: Returns the prompts of a workspace, optionally narrowed to one label
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: query
	 *          name: workspaceId
	 *          required: true
	 *          schema:
	 *            type: number
	 *        - in: query
	 *          name: labelId
	 *          required: false
	 *          schema:
	 *            type: number
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: array
	 *                items:
	 *                  $ref: "#/components/schemas/Prompt"
	 */
	private async findAllByWorkspace(
		options: APIHandlerOptions<{ query: GetPromptsRequestDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findByWorkspace(options.query),
			status: HTTPCode.OK,
		};
	}
}

export { PromptController };
