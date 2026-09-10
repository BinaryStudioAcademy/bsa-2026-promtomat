import { getErrorDetails } from "~/libs/helpers/helpers.js";
import { TextGenerationError } from "~/libs/modules/generator/generator.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type ScheduleOptions,
	type Scheduler,
} from "~/libs/modules/scheduler/scheduler.js";
import { type PromptService } from "~/modules/prompts/prompt.service.js";

import {
	BACKFILL_CRON_EXPRESSION,
	BACKFILL_LABELS_LIMIT,
	BACKFILL_TIMEZONE,
	UNEXPECTED_ERROR,
} from "../constants/constants.js";
import { type PromptLabelSource } from "../types/types.js";

const INITIAL_AFTER_ID = 0;

type Constructor = {
	logger: Logger;
	promptService: PromptService;
	scheduler: Scheduler;
};

class BackFillPromptLabelsJob {
	private logger: Logger;

	private promptService: PromptService;

	private scheduler: Scheduler;

	public constructor({ logger, promptService, scheduler }: Constructor) {
		this.logger = logger;
		this.promptService = promptService;
		this.scheduler = scheduler;
	}

	private getOptions(): ScheduleOptions {
		return {
			expression: BACKFILL_CRON_EXPRESSION,
			timezone: BACKFILL_TIMEZONE,
		};
	}

	private logError(error: unknown, prompt: PromptLabelSource): void {
		const reason =
			error instanceof TextGenerationError ? error.message : UNEXPECTED_ERROR;

		this.logger.error(
			`failed to backfill label for prompt ${prompt.id.toString()}: ${reason}.`,
			getErrorDetails(error),
		);
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
					this.logger.info(
						`Generated a label for prompt ${prompt.id.toString()}.`,
					);
				} catch (error) {
					this.logError(error, prompt);
				}
			}
		} while (prompts.length === BACKFILL_LABELS_LIMIT);
	}

	public scheduleBackfill() {
		this.scheduler.schedule(this.getOptions(), () => this.run());
	}
}

export { BackFillPromptLabelsJob };
