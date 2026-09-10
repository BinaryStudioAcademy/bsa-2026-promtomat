import { TextGenerationError } from "~/libs/modules/generator/generator.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type CronJob,
	type ScheduleOptions,
} from "~/libs/modules/scheduler/scheduler.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";

import {
	BACKFILL_CRON_EXPRESSION,
	BACKFILL_LABELS_LIMIT,
	BACKFILL_TIMEZONE,
} from "../constants/constants.js";
import { type PromptLabelSource } from "../types/types.js";

const INITIAL_AFTER_ID = 0;

type Constructor = {
	logger: Logger;
	promptService: PromptService;
};

class BackFillPromptLabelsJob implements CronJob {
	private logger: Logger;

	private promptService: PromptService;

	public constructor({ logger, promptService }: Constructor) {
		this.logger = logger;
		this.promptService = promptService;
	}

	private logError(error: unknown, prompt: PromptLabelSource): void {
		const reason =
			error instanceof TextGenerationError
				? "text generation failed"
				: "an unexpected error occurred";

		this.logger.error(
			`failed to backfill label for prompt ${prompt.id.toString()}: ${reason}.`,
			{
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			},
		);
	}

	public getOptions(): ScheduleOptions {
		return {
			expression: BACKFILL_CRON_EXPRESSION,
			timezone: BACKFILL_TIMEZONE,
		};
	}

	public async run(): Promise<void> {
		let afterId = INITIAL_AFTER_ID;
		let prompts: PromptLabelSource[];

		do {
			prompts = await this.promptService.findPromptsWithoutLabels(
				BACKFILL_LABELS_LIMIT,
				afterId,
			);

			for (const prompt of prompts) {
				afterId = prompt.id;

				try {
					await this.promptService.regenerateLabel(prompt);
				} catch (error) {
					this.logError(error, prompt);
				}
			}
		} while (prompts.length === BACKFILL_LABELS_LIMIT);
	}
}

export { BackFillPromptLabelsJob };
