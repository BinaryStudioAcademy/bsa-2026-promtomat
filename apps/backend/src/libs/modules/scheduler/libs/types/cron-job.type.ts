import { ScheduleOptions } from "./schedule-options.type.js";

type CronJob = {
	getOptions(): ScheduleOptions;
	run(): Promise<void>;
};

export { CronJob };
