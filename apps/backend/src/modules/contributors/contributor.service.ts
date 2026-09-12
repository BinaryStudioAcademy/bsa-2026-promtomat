import { ContributorError, UserError } from "~/libs/exceptions/exceptions.js";
import { type UserService } from "~/modules/users/user.service.js";

import { ContributorEntity } from "./contributor.entity.js";
import { type ContributorRepository } from "./contributor.repository.js";
import {
	type ContributorCreatePayload,
	type ContributorDto,
} from "./libs/types/types.js";

class ContributorService {
	private contributorRepository: ContributorRepository;

	private userService: UserService;

	public constructor(
		contributorRepository: ContributorRepository,
		userService: UserService,
	) {
		this.contributorRepository = contributorRepository;
		this.userService = userService;
	}

	public async add(
		payload: ContributorCreatePayload,
		ownerId: number,
	): Promise<ContributorDto> {
		if (payload.userId === ownerId) {
			throw ContributorError.ownerCannotBeAdded();
		}

		const targetUser = await this.userService.findById(payload.userId);

		if (!targetUser) {
			throw UserError.notFound();
		}

		const contributor = await this.contributorRepository.create(
			ContributorEntity.initializeNew(payload),
		);

		return contributor.toObject();
	}
}

export { ContributorService };
