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
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";
import {
	promptCreateValidationSchema,
	promptGetByQueryValidationSchema,
	promptWorkspaceQueryValidationSchema,
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
 *      PromptProgress:
 *        type: object
 *        properties:
 *          count:
 *            type: number
 *          target:
 *            type: number
 *      PromptRecent:
 *        type: object
 *        properties:
 *          efficiencyScore:
 *            type: number
 *          id:
 *            type: number
 *            minimum: 1
 *          taskIntent:
 *            type: string
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
				this.findProgress(
					options as APIHandlerOptions<{
						query: PromptWorkspaceQueryDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.PROGRESS,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				query: promptWorkspaceQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findRecent(
					options as APIHandlerOptions<{
						query: PromptWorkspaceQueryDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.RECENT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				query: promptWorkspaceQueryValidationSchema,
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

	/**
	 * @swagger
	 * /prompts/progress:
	 *    get:
	 *      description: Returns recorded prompt count and target for a workspace
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: query
	 *          name: workspaceId
	 *          required: true
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *          description: Workspace to count prompts in
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/PromptProgress"
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
	private async findProgress(
		options: APIHandlerOptions<{ query: PromptWorkspaceQueryDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findProgress(options.query.workspaceId),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /prompts/recent:
	 *    get:
	 *      description: Returns the most recent recorded prompts for a workspace
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: query
	 *          name: workspaceId
	 *          required: true
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *          description: Workspace to list recent prompts from
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  items:
	 *                    type: array
	 *                    items:
	 *                      $ref: "#/components/schemas/PromptRecent"
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
	private async findRecent(
		options: APIHandlerOptions<{ query: PromptWorkspaceQueryDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findRecent(options.query.workspaceId),
			status: HTTPCode.OK,
		};
	}
}

export { PromptController };
