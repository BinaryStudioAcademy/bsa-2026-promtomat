import { UniqueViolationError } from "objection";

import { SortOrder } from "~/libs/enums/enums.js";
import { ApiTokenError } from "~/libs/exceptions/exceptions.js";

import { ApiTokenEntity } from "./api-token.entity.js";
import { type ApiTokenModel } from "./api-token.model.js";
import { ApiTokenColumnName } from "./libs/enums/enums.js";

class ApiTokenRepository {
	private apiTokenModel: typeof ApiTokenModel;

	public constructor(apiTokenModel: typeof ApiTokenModel) {
		this.apiTokenModel = apiTokenModel;
	}

	public async create(entity: ApiTokenEntity): Promise<ApiTokenEntity> {
		try {
			const token = await this.apiTokenModel
				.query()
				.insert(entity.toNewObject())
				.execute();

			return ApiTokenEntity.initialize(token);
		} catch (error) {
			if (error instanceof UniqueViolationError) {
				throw ApiTokenError.nameAlreadyExists();
			}

			throw error;
		}
	}

	public async deleteByPublicIdAndUserId(
		publicId: string,
		userId: number,
	): Promise<number> {
		return await this.apiTokenModel
			.query()
			.delete()
			.where({ publicId, userId })
			.execute();
	}

	public async findAllByUserId(userId: number): Promise<ApiTokenEntity[]> {
		const tokens = await this.apiTokenModel
			.query()
			.select(
				ApiTokenColumnName.LAST_USED_AT,
				ApiTokenColumnName.NAME,
				ApiTokenColumnName.PUBLIC_ID,
				ApiTokenColumnName.USER_ID,
				ApiTokenColumnName.EXPIRES_AT,
			)
			.where({ userId })
			.orderBy(ApiTokenColumnName.CREATED_AT, SortOrder.DESC)
			.execute();

		return tokens.map((token) => ApiTokenEntity.initialize(token));
	}

	public async findByPublicId(
		publicId: string,
	): Promise<ApiTokenEntity | null> {
		const token = await this.apiTokenModel.query().findOne({ publicId });

		return token ? ApiTokenEntity.initialize(token) : null;
	}

	public async updateLastUsedAt(
		publicId: string,
		lastUsedAt: string,
	): Promise<void> {
		await this.apiTokenModel
			.query()
			.patch({ lastUsedAt })
			.where({ publicId })
			.execute();
	}
}

export { ApiTokenRepository };
