import { type RateLimitService } from "./libs/types/types.js";

const NO_ATTEMPTS = 0;

type Constructor = {
	intervalMs: number;
	limit: number;
	maximumTrackedKeys: number;
};

// Counters live in this process only. They reset on restart, and each instance
// keeps its own map, so behind a load balancer the effective limit becomes
// limit x instance count. Adequate for a single instance; not a shared limit.
// TODO: Replace with a shared store (Redis or a table) before scaling out.
class InMemoryRateLimitService implements RateLimitService {
	private attempts = new Map<string, number[]>();

	private intervalMs: number;

	private limit: number;

	private maximumTrackedKeys: number;

	public constructor({ intervalMs, limit, maximumTrackedKeys }: Constructor) {
		this.intervalMs = intervalMs;
		this.limit = limit;
		this.maximumTrackedKeys = maximumTrackedKeys;
	}

	private sweep(cutoff: number): void {
		for (const [key, timestamps] of this.attempts) {
			const recent = timestamps.filter((timestamp) => timestamp > cutoff);

			if (recent.length === NO_ATTEMPTS) {
				this.attempts.delete(key);
			} else {
				this.attempts.set(key, recent);
			}
		}
	}

	public consume(key: string): boolean {
		const now = Date.now();
		const cutoff = now - this.intervalMs;

		if (this.attempts.size > this.maximumTrackedKeys) {
			this.sweep(cutoff);
		}

		const recent = (this.attempts.get(key) ?? []).filter(
			(timestamp) => timestamp > cutoff,
		);

		if (recent.length >= this.limit) {
			this.attempts.set(key, recent);

			return false;
		}

		recent.push(now);
		this.attempts.set(key, recent);

		return true;
	}
}

export { InMemoryRateLimitService };
