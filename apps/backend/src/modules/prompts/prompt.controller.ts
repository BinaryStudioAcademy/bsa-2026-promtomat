import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserDto } from "~/modules/users/libs/types/types.js";

import { PromptsApiPath } from "./libs/enums/enums.js";
import {
	type PromptCreateRequestDto,
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";
import {
	promptCreateValidationSchema,
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

	public constructor(logger: Logger, promptService: PromptService) {
		super(logger, APIPath.PROMPTS);

		this.promptService = promptService;

		this.addRoute({
			handler: (options) =>
				this.findProgress(
					options as APIHandlerOptions<{
						query: PromptWorkspaceQueryDto;
					}> & { user: UserDto },
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.PROGRESS,
			validation: {
				query: promptWorkspaceQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findRecent(
					options as APIHandlerOptions<{
						query: PromptWorkspaceQueryDto;
					}> & { user: UserDto },
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.RECENT,
			validation: {
				query: promptWorkspaceQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: PromptCreateRequestDto;
					}> & { user: UserDto },
				),
			method: HTTPMethod.POST,
			path: PromptsApiPath.ROOT,
			validation: {
				body: promptCreateValidationSchema,
			},
		});
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
	 *        403:
	 *          description: You do not have permission to access this workspace
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
	private async create(
		options: APIHandlerOptions<{ body: PromptCreateRequestDto }> & {
			user: UserDto;
		},
	): Promise<APIHandlerResponse> {
		const payload = {
			...options.body,
			userId: options.user.id,
		};
		return {
			payload: await this.promptService.create(payload),
			status: HTTPCode.CREATED,
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
		options: APIHandlerOptions<{ query: PromptWorkspaceQueryDto }> & {
			user: UserDto;
		},
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findProgress({
				userId: options.user.id,
				workspaceId: options.query.workspaceId,
			}),
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
		options: APIHandlerOptions<{ query: PromptWorkspaceQueryDto }> & {
			user: UserDto;
		},
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findRecent({
				userId: options.user.id,
				workspaceId: options.query.workspaceId,
			}),
			status: HTTPCode.OK,
		};
	}
}

export { PromptController };
