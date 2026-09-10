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

import { type ComposedPromptService } from "./composed-prompt.service.js";
import { ComposedPromptsApiPath } from "./libs/enums/enums.js";
import {
	type ComposedPromptIdParametersDto,
	type ComposeRequestDto,
} from "./libs/types/types.js";
import {
	composedPromptIdParametersValidationSchema,
	composeValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";

/*** @swagger
 * components:
 *    schemas:
 *      ComposedPromptSource:
 *        type: object
 *        properties:
 *          promptId:
 *            type: number
 *          rank:
 *            type: number
 *            minimum: 1
 *          taskIntent:
 *            type: string
 *      ComposedPrompt:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          workspaceId:
 *            type: number
 *          description:
 *            type: string
 *          body:
 *            type: string
 *            description: Markdown
 *          explanation:
 *            type: string
 *            description: Plain prose referring to sources by number
 *          modelId:
 *            type: string
 *          sources:
 *            type: array
 *            items:
 *              $ref: "#/components/schemas/ComposedPromptSource"
 *          createdAt:
 *            type: string
 *            format: date-time
 *      PromptCandidate:
 *        type: object
 *        properties:
 *          promptId:
 *            type: number
 *          taskIntent:
 *            type: string
 *          promptBody:
 *            type: string
 *          efficiencyScore:
 *            type: number
 *      ComposeResponse:
 *        oneOf:
 *          - type: object
 *            properties:
 *              kind:
 *                type: string
 *                enum: [composed]
 *              composedPrompt:
 *                $ref: "#/components/schemas/ComposedPrompt"
 *          - type: object
 *            properties:
 *              kind:
 *                type: string
 *                enum: [fallback]
 *              reason:
 *                type: string
 *                enum: [unavailable, timeout, unusable]
 *              prompt:
 *                $ref: "#/components/schemas/PromptCandidate"
 *          - type: object
 *            properties:
 *              kind:
 *                type: string
 *                enum: [no-matches]
 */
class ComposedPromptController extends BaseController {
	private composedPromptService: ComposedPromptService;

	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		composedPromptService: ComposedPromptService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.COMPOSED_PROMPTS);

		this.composedPromptService = composedPromptService;
		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.compose(options as APIHandlerOptions<{ body: ComposeRequestDto }>),
			method: HTTPMethod.POST,
			path: ComposedPromptsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				body: composeValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findById(
					options as APIHandlerOptions<{
						params: ComposedPromptIdParametersDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: ComposedPromptsApiPath.$ID,
			validation: {
				params: composedPromptIdParametersValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /composed-prompts:
	 *    post:
	 *      description: Composes one prompt for a task description from the closest prompts of the workspace
	 *      security:
	 *        - bearerAuth: []
	 *      requestBody:
	 *        description: Task description and the workspace to draw on
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                description:
	 *                  type: string
	 *                  minLength: 5
	 *                  maxLength: 255
	 *                workspaceId:
	 *                  type: number
	 *                  minimum: 1
	 *      responses:
	 *        201:
	 *          description: A composed prompt was created
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/ComposeResponse"
	 *        200:
	 *          description: An existing composed prompt for the same description, a fallback with the best candidate, or no matches
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/ComposeResponse"
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
	private async compose(
		options: APIHandlerOptions<{ body: ComposeRequestDto }>,
	): Promise<APIHandlerResponse> {
		const { isCreated, response } = await this.composedPromptService.compose({
			...options.body,
			userId: options.user?.id as number,
		});

		return {
			payload: response,
			status: isCreated ? HTTPCode.CREATED : HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /composed-prompts/{id}:
	 *    get:
	 *      description: Returns a composed prompt of a workspace the caller may read
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          required: true
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/ComposedPrompt"
	 *        401:
	 *          description: Unauthorized
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Error"
	 *        404:
	 *          description: Composed prompt not found, or its workspace is not readable by the caller
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
	private async findById(
		options: APIHandlerOptions<{ params: ComposedPromptIdParametersDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.composedPromptService.findById(
				options.params.id,
				options.user?.id as number,
			),
			status: HTTPCode.OK,
		};
	}
}

export { ComposedPromptController };
