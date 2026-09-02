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
