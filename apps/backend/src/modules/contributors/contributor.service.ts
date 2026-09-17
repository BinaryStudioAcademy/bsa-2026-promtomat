import { ContributorError, UserError } from "~/libs/exceptions/exceptions.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	type WorkspaceAddContributorRequestDto,
	type WorkspaceContributorsResponseDto,
} from "../workspaces/libs/types/types.js";
import { ContributorEntity } from "./contributor.entity.js";
import { type ContributorRepository } from "./contributor.repository.js";
import { type ContributorDto } from "./libs/types/types.js";

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
		payload: WorkspaceAddContributorRequestDto & { workspaceId: number },
		ownerId: number,
	): Promise<ContributorDto> {
		const targetUser = await this.userService.findByEmail(payload.email);

		if (!targetUser) {
			throw UserError.notFound();
		}

		const { id: userId } = targetUser.toObject();

		if (userId === ownerId) {
			throw ContributorError.ownerCannotBeAdded();
		}

		const contributor = await this.contributorRepository.create(
			ContributorEntity.initializeNew({
				userId,
				workspaceId: payload.workspaceId,
			}),
		);

		return contributor.toObject();
	}

	public async findAllByWorkspaceId(
		workspaceId: number,
	): Promise<WorkspaceContributorsResponseDto> {
		const [owner, contributors] = await Promise.all([
			this.contributorRepository.findOwnerByWorkspaceId(workspaceId),
			this.contributorRepository.findAllByWorkspaceId(workspaceId),
		]);

		return {
			contributors,
			owner,
		};
	}
	public async remove(workspaceId: number, userId: number): Promise<void> {
		const deletedContributorCount =
			await this.contributorRepository.deleteByWorkspaceIdAndUserId(
				workspaceId,
				userId,
			);

		if (!deletedContributorCount) {
			throw ContributorError.notFound();
		}
	}
}

export { ContributorService };
