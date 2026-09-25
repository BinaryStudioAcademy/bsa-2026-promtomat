import { type Transaction } from "objection";

import { type UserStreak } from "./libs/types/types.js";
import { type UserRepository } from "./user.repository.js";

type Constructor = {
	userRepository: UserRepository;
};

class UserStreakService {
	private userRepository: UserRepository;

	public constructor({ userRepository }: Constructor) {
		this.userRepository = userRepository;
	}

	public async findByUserId(userId: number): Promise<null | UserStreak> {
		return await this.userRepository.findStreakByUserId(userId);
	}

	public async recomputeForTimeZone(
		userId: number,
		timeZone: string,
	): Promise<number> {
		return await this.userRepository.updateStreakForTimeZone(userId, timeZone);
	}

	public async recordPromptLog(
		userId: number,
		trx?: Transaction,
	): Promise<void> {
		await this.userRepository.updateStreakOnPromptLog(userId, trx);
	}
}

export { UserStreakService };
