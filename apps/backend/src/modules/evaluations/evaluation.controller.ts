import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
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
			method: "POST",
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
