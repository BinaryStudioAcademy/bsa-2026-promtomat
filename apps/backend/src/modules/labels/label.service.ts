import { Transaction } from "objection";

import { GeneratorInterface } from "~/libs/modules/generator/generator.js";

import { LabelEntity } from "./label.entity.js";
import { type LabelRepository } from "./label.repository.js";
import { type LabelCreatePayload, LabelDto } from "./libs/types/types.js";

class LabelService {
	private generator: GeneratorInterface;
	private labelRepository: LabelRepository;

	public constructor(
		labelRepository: LabelRepository,
		generator: GeneratorInterface,
	) {
		this.labelRepository = labelRepository;
		this.generator = generator;
	}

	public async create(
		payload: LabelCreatePayload,
		trx?: Transaction,
	): Promise<LabelDto> {
		const label = await this.labelRepository.create(
			LabelEntity.initializeNew(payload),
			trx,
		);

		return label.toObject();
	}

	public async findAll(workspaceId: number) {
		const labels = await this.labelRepository.findAll(workspaceId);

		return labels.map((label) => label.toObject().name);
	}

	public findByName(
		name: string,
		workspaceId: number,
		trx?: Transaction,
	): Promise<LabelEntity | null> {
		return this.labelRepository.findByName(name, workspaceId, trx);
	}

	public async getOrCreate(
		payload: LabelCreatePayload,
		trx?: Transaction,
	): Promise<LabelDto> {
		const label = await this.labelRepository.createIfAbsent(
			LabelEntity.initializeNew(payload),
			trx,
		);

		return label.toObject();
	}
}

export { LabelService };
