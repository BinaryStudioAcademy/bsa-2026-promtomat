import { type RateLimitService } from "./libs/types/types.js";

const NO_ATTEMPTS = 0;

const NOTHING_TO_EVICT = 0;

type Constructor = {
	intervalMs: number;
	limit: number;
	maximumTrackedKeys: number;
};

// Counters live in this process only. They reset on restart, and each instance
// keeps its own map, so behind a load balancer the effective limit becomes
// limit x instance count. Adequate for a single instance; not a shared limit.
// TODO: Replace with a shared store (Redis or a table) before scaling out in the future.
class InMemoryRateLimitService implements RateLimitService {
	private attempts = new Map<string, number[]>();

	private intervalMs: number;

	private lastSweptAt = NOTHING_TO_EVICT;

	private limit: number;

	private maximumTrackedKeys: number;

	public constructor({ intervalMs, limit, maximumTrackedKeys }: Constructor) {
		this.intervalMs = intervalMs;
		this.limit = limit;
		this.maximumTrackedKeys = maximumTrackedKeys;
	}

	private evictOldest(): void {
		while (this.attempts.size >= this.maximumTrackedKeys) {
			const [oldestKey] = this.attempts.keys();

			if (oldestKey === undefined) {
				return;
			}

			this.attempts.delete(oldestKey);
		}
	}

	private sweep(now: number, cutoff: number): void {
		if (now - this.lastSweptAt < this.intervalMs) {
			return;
		}

		this.lastSweptAt = now;

		for (const [key, timestamps] of this.attempts) {
			const recent = timestamps.filter((timestamp) => timestamp > cutoff);

			if (recent.length === NO_ATTEMPTS) {
				this.attempts.delete(key);
			} else {
				this.attempts.set(key, recent);
			}
		}
	}

	private touch(key: string, timestamps: number[]): void {
		this.attempts.delete(key);
		this.attempts.set(key, timestamps);
	}

	public consume(key: string): boolean {
		const now = Date.now();
		const cutoff = now - this.intervalMs;
		const isKnownKey = this.attempts.has(key);

		if (!isKnownKey && this.attempts.size >= this.maximumTrackedKeys) {
			this.sweep(now, cutoff);
			this.evictOldest();
		}

		const recent = (this.attempts.get(key) ?? []).filter(
			(timestamp) => timestamp > cutoff,
		);

		if (recent.length >= this.limit) {
			this.touch(key, recent);

			return false;
		}

		recent.push(now);
		this.touch(key, recent);

		return true;
	}
}

export { InMemoryRateLimitService };
