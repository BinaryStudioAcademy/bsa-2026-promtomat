import { schedule } from "node-cron";

import { type ScheduleOptions, type Scheduler } from "./libs/types/types.js";

class CronScheduler implements Scheduler {
	public schedule(
		{ expression, timezone }: ScheduleOptions,
		task: () => Promise<void>,
	): void {
		schedule(expression, task, { noOverlap: true, timezone, unref: true });
	}
}

export { CronScheduler };
