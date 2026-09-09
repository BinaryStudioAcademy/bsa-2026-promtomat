import { Transaction } from "objection";

import {
	CREATE_LABEL_CONFLICT_COLUMNS,
	CREATE_LABEL_MERGE_COLUMNS,
} from "./constants/constants.js";
import { LabelEntity } from "./label.entity.js";
import { type LabelModel } from "./label.model.js";

class LabelRepository {
	private labelModel: typeof LabelModel;

	public constructor(promptModel: typeof LabelModel) {
		this.labelModel = promptModel;
	}

	public async create(
		entity: LabelEntity,
		trx?: Transaction,
	): Promise<LabelEntity> {
		const label = await this.labelModel
			.query(trx)
			.insert(entity.toNewObject())
			.onConflict("name")
			.merge({})
			.returning("*")
			.execute();

		return LabelEntity.initialize(label);
	}

	public async createIfAbsent(
		entity: LabelEntity,
		trx?: Transaction,
	): Promise<LabelEntity> {
		const label = await this.labelModel
			.query(trx)
			.insert(entity.toNewObject())
			.onConflict(CREATE_LABEL_CONFLICT_COLUMNS)
			.merge(CREATE_LABEL_MERGE_COLUMNS)
			.returning("*")
			.execute();

		return LabelEntity.initialize(label);
	}

	public async findAll(workspaceId: number): Promise<LabelEntity[]> {
		const labels = await this.labelModel
			.query()
			.where({ workspaceId })
			.execute();

		return labels.map((label) => LabelEntity.initialize(label));
	}

	public async findByName(
		name: string,
		workspaceId: number,
		trx?: Transaction,
	): Promise<LabelEntity | null> {
		const label = await this.labelModel
			.query(trx)
			.findOne({ name, workspaceId })
			.execute();
		return label ? LabelEntity.initialize(label) : null;
	}
}

export { LabelRepository };
