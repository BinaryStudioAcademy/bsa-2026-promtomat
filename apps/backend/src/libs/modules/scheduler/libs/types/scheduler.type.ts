import { type ScheduleOptions } from "./schedule-options.type.js";

type Scheduler = {
	schedule(options: ScheduleOptions, task: () => Promise<void>): void;
};

export { type Scheduler };
