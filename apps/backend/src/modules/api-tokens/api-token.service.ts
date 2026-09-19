import {
	createHash,
	randomBytes,
	randomUUID,
	timingSafeEqual,
} from "node:crypto";

import { API_TOKEN_PREFIX } from "~/libs/constants/constants.js";
import { ApiTokenError } from "~/libs/exceptions/exceptions.js";
import {
	type ApiTokenDto,
	type ApiTokenResponseDto,
} from "~/libs/types/types.js";

import { ApiTokenEntity } from "./api-token.entity.js";
import { type ApiTokenRepository } from "./api-token.repository.js";
import {
	DIGEST_ALGORITHM,
	NO_ROWS_DELETED,
	SECRET_BYTE_LENGTH,
	SECRET_ENCODING,
	TOKEN_PARTS_LIMIT,
} from "./libs/constants/constants.js";

class ApiTokenService {
	private apiTokenRepository: ApiTokenRepository;

	public constructor(apiTokenRepository: ApiTokenRepository) {
		this.apiTokenRepository = apiTokenRepository;
	}

	private hash(secret: string): string {
		return createHash(DIGEST_ALGORITHM).update(secret).digest(SECRET_ENCODING);
	}

	public async delete(publicId: string, userId: number): Promise<void> {
		const deletedCount =
			await this.apiTokenRepository.deleteByPublicIdAndUserId(publicId, userId);

		if (deletedCount === NO_ROWS_DELETED) {
			throw ApiTokenError.notFound();
		}
	}

	public async findAllByUserId(userId: number): Promise<ApiTokenDto[]> {
		const tokens = await this.apiTokenRepository.findAllByUserId(userId);

		return tokens.map((token) => token.toObject());
	}

	public async issue(
		name: string,
		userId: number,
	): Promise<ApiTokenResponseDto> {
		const publicId = randomUUID();
		const secret = randomBytes(SECRET_BYTE_LENGTH).toString(SECRET_ENCODING);
		const tokenHash = this.hash(secret);

		await this.apiTokenRepository.create(
			ApiTokenEntity.initializeNew({
				name,
				publicId,
				tokenHash,
				userId,
			}),
		);

		return {
			id: publicId,
			name,
			value: `${API_TOKEN_PREFIX}${publicId}.${secret}`,
		};
	}

	public async revoke() {}

	public async verify(token: string): Promise<null | number> {
		if (!token.startsWith(API_TOKEN_PREFIX)) {
			return null;
		}

		const stripped = token.slice(API_TOKEN_PREFIX.length);
		const [id, value] = stripped.split(".", TOKEN_PARTS_LIMIT);
		if (!id || !value) {
			return null;
		}

		const foundToken = await this.apiTokenRepository.findByPublicId(id);
		if (!foundToken) {
			return null;
		}

		const object = foundToken.toAuthObject();
		const inputTokenHash = Buffer.from(this.hash(value), SECRET_ENCODING);
		const storedHash = Buffer.from(object.tokenHash, SECRET_ENCODING);

		if (
			storedHash.length === inputTokenHash.length &&
			timingSafeEqual(storedHash, inputTokenHash)
		) {
			return object.userId;
		}

		return null;
	}
}

export { ApiTokenService };
