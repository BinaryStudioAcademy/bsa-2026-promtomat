import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ComposedPromptService } from "~/modules/composed-prompts/composed-prompt.service.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";
import { type UserDto } from "~/modules/users/libs/types/types.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type EvaluationService } from "./evaluation.service.js";
import { EvaluationsApiPath } from "./libs/enums/enums.js";
import { evaluationAccessHook } from "./libs/hooks/hooks.js";
import { type EvaluationCreateRequestDto } from "./libs/types/types.js";
import { evaluationCreateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

type Constructor = {
	apiPath: string;
	composedPromptService: ComposedPromptService;
	evaluationService: EvaluationService;
	logger: Logger;
	promptService: PromptService;
	workspaceService: WorkspaceService;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     EvaluationCreateRequest:
 *       type: object
 *       required:
 *         - score
 *       properties:
 *         promptId:
 *           type: number
 *           nullable: true
 *         composedPromptId:
 *           type: number
 *           nullable: true
 *         score:
 *           type: number
 *           minimum: 1
 *           maximum: 10
 *     Evaluation:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - score
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: number
 *         userId:
 *           type: number
 *         promptId:
 *           type: number
 *           nullable: true
 *         composedPromptId:
 *           type: number
 *           nullable: true
 *         score:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
class EvaluationController extends BaseController {
	private evaluationService: EvaluationService;

	public constructor({
		apiPath,
		composedPromptService,
		evaluationService,
		logger,
		promptService,
		workspaceService,
	}: Constructor) {
		super(logger, apiPath);

		this.evaluationService = evaluationService;

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: EvaluationCreateRequestDto;
						user: UserDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: EvaluationsApiPath.ROOT,
			preHandler: evaluationAccessHook({
				composedPromptService,
				promptService,
				workspaceService,
			}),
			validation: {
				body: evaluationCreateValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /evaluations:
	 *   post:
	 *     description: Create or update an evaluation for a prompt or composed prompt
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: "#/components/schemas/EvaluationCreateRequest"
	 *     responses:
	 *       201:
	 *         description: Evaluation successfully created or updated
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Evaluation"
	 *       400:
	 *         description: Bad request
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       403:
	 *         description: Forbidden
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       404:
	 *         description: Resource not found
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
	private async create(
		options: APIHandlerOptions<{
			body: EvaluationCreateRequestDto;
			user: UserDto;
		}>,
	): Promise<APIHandlerResponse> {
		const { id: userId } = options.user as UserDto;

		const evaluation = await this.evaluationService.create({
			...options.body,
			userId,
		});

		return {
			payload: evaluation,
			status: HTTPCode.CREATED,
		};
	}
}

export { EvaluationController };
