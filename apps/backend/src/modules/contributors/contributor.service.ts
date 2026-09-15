import { ContributorError, UserError } from "~/libs/exceptions/exceptions.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	type WorkspaceContributorCandidatesQueryDto,
	type WorkspaceContributorCandidatesResponseDto,
	type WorkspaceContributorsResponseDto,
} from "../workspaces/libs/types/types.js";
import { ContributorEntity } from "./contributor.entity.js";
import { type ContributorRepository } from "./contributor.repository.js";
import {
	CONTRIBUTOR_CANDIDATES_LOOKAHEAD_COUNT,
	CONTRIBUTOR_CANDIDATES_PAGE_SIZE,
} from "./libs/constants/constants.js";
import {
	decodeContributorCandidatesCursor,
	encodeContributorCandidatesCursor,
} from "./libs/helpers/helpers.js";
import {
	type ContributorCandidateQuery,
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
	public async findCandidates(
		workspaceId: number,
		ownerId: number,
		query: WorkspaceContributorCandidatesQueryDto,
	): Promise<WorkspaceContributorCandidatesResponseDto> {
		const candidateQuery: ContributorCandidateQuery = {
			limit:
				CONTRIBUTOR_CANDIDATES_PAGE_SIZE +
				CONTRIBUTOR_CANDIDATES_LOOKAHEAD_COUNT,
			ownerId,
			userQuery: query.userQuery ?? "",
			workspaceId,
		};

		if (query.cursor) {
			candidateQuery.cursor = decodeContributorCandidatesCursor(query.cursor);
		}

		const candidates =
			await this.contributorRepository.findCandidates(candidateQuery);

		const checkHasNextPage =
			candidates.length > CONTRIBUTOR_CANDIDATES_PAGE_SIZE;

		let nextCursor: WorkspaceContributorCandidatesResponseDto["nextCursor"] =
			null;

		if (checkHasNextPage) {
			candidates.pop();

			const lastCandidates = candidates.slice(
				-CONTRIBUTOR_CANDIDATES_LOOKAHEAD_COUNT,
			);

			for (const lastCandidate of lastCandidates) {
				nextCursor = encodeContributorCandidatesCursor({
					id: lastCandidate.id,
					nickname: lastCandidate.nickname,
				});
			}
		}

		return {
			items: candidates,
			nextCursor,
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
