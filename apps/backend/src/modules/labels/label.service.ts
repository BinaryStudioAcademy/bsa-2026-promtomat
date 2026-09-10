import { type Transaction } from "objection";

import { LabelError } from "~/libs/exceptions/exceptions.js";

import { LabelEntity } from "./label.entity.js";
import { type LabelRepository } from "./label.repository.js";
import { normalizePromptLabel } from "./libs/helpers/helpers.js";
import {
	type LabelCreatePayload,
	type LabelDto,
	type LabelWithPromptCountDto,
} from "./libs/types/types.js";

class LabelService {
	private labelRepository: LabelRepository;

	public constructor(labelRepository: LabelRepository) {
		this.labelRepository = labelRepository;
	}

	public async findAllWithPromptCounts(
		workspaceId: number,
	): Promise<LabelWithPromptCountDto[]> {
		return await this.labelRepository.findAllWithPromptCounts(workspaceId);
	}

	public async findMostUsedNames(
		workspaceId: number,
		limit: number,
	): Promise<string[]> {
		return await this.labelRepository.findMostUsedNames(workspaceId, limit);
	}

	public async getOrCreate(
		payload: LabelCreatePayload,
		trx?: Transaction,
	): Promise<LabelDto> {
		const normalizedName = normalizePromptLabel(payload.name);

		if (normalizedName === null) {
			throw LabelError.unusableName();
		}

		const label = await this.labelRepository.createIfAbsent(
			LabelEntity.initializeNew({ ...payload, name: normalizedName }),
			trx,
		);

		return label.toObject();
	}
}

export { LabelService };
