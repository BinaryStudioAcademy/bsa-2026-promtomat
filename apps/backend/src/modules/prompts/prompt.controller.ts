import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { PromptsApiPath } from "./libs/enums/enums.js";
import { type PromptCreateRequestDto } from "./libs/types/types.js";
import { promptCreateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
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
 */
class PromptController extends BaseController {
	private promptService: PromptService;

	public constructor(logger: Logger, promptService: PromptService) {
		super(logger, APIPath.PROMPTS);

		this.promptService = promptService;

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: PromptCreateRequestDto;
					}>,
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
		options: APIHandlerOptions<{ body: PromptCreateRequestDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.create(
				options.body,
				options.user?.id as number,
			),
			status: HTTPCode.CREATED,
		};
	}
}

export { PromptController };
