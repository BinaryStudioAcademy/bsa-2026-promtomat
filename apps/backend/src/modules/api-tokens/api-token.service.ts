import {
	createHash,
	randomBytes,
	randomUUID,
	timingSafeEqual,
} from "node:crypto";

import { API_TOKEN_PREFIX } from "~/libs/constants/constants.js";
import { ApiTokenError } from "~/libs/exceptions/exceptions.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type ApiTokenDto,
	type ApiTokenExpirationValue,
	type ApiTokenResponseDto,
} from "~/libs/types/types.js";

import { ApiTokenEntity } from "./api-token.entity.js";
import { type ApiTokenRepository } from "./api-token.repository.js";
import {
	DIGEST_ALGORITHM,
	LAST_USED_THROTTLE_MS,
	NO_ROWS_COUNT,
	SECRET_BYTE_LENGTH,
	SECRET_ENCODING,
	TOKEN_PARTS_LIMIT,
} from "./libs/constants/constants.js";
import { ApiTokenLogMessage } from "./libs/enums/enums.js";
import { createExpirationDate } from "./libs/helpers/helpers.js";

class ApiTokenService {
	private apiTokenRepository: ApiTokenRepository;

	private logger: Logger;

	public constructor(apiTokenRepository: ApiTokenRepository, logger: Logger) {
		this.apiTokenRepository = apiTokenRepository;
		this.logger = logger;
	}

	private checkIsLastUsedStale(lastUsedAt: null | string): boolean {
		if (!lastUsedAt) {
			return true;
		}

		const elapsed = Date.now() - new Date(lastUsedAt).getTime();

		return elapsed >= LAST_USED_THROTTLE_MS;
	}

	private createToken(
		name: string,
		userId: number,
		expiration: ApiTokenExpirationValue,
	) {
		const secret = randomBytes(SECRET_BYTE_LENGTH).toString(SECRET_ENCODING);
		return {
			expiresAt: createExpirationDate(expiration),
			name,
			publicId: randomUUID(),
			secret,
			tokenHash: this.hash(secret),
			userId,
		};
	}

	private createTokenResponseDto({
		name,
		publicId,
		secret,
	}: ReturnType<typeof this.createToken>) {
		return {
			id: publicId,
			name,
			value: `${API_TOKEN_PREFIX}${publicId}.${secret}`,
		};
	}

	private hash(secret: string): string {
		return createHash(DIGEST_ALGORITHM).update(secret).digest(SECRET_ENCODING);
	}

	private isTokenExpired(token: ApiTokenEntity) {
		const tokenObject = token.toObject();

		if (tokenObject.expiresAt === null) {
			return false;
		}

		const expiresAt = new Date(tokenObject.expiresAt).getTime();

		return Date.now() >= expiresAt;
	}

	private stripToken(token: string): [string, string] {
		if (!token.startsWith(API_TOKEN_PREFIX)) {
			throw ApiTokenError.failedToParse();
		}

		const stripped = token.slice(API_TOKEN_PREFIX.length);
		const [id, value] = stripped.split(".", TOKEN_PARTS_LIMIT);
		if (!id || !value) {
			throw ApiTokenError.failedToParse();
		}

		return [id, value];
	}

	private async updateLastUsedAndGetUserId(token: ApiTokenEntity) {
		const object = token.toAuthObject();
		await this.updateLastUsedAt(object.publicId, object.lastUsedAt);

		return object.userId;
	}

	private async updateLastUsedAt(
		publicId: string,
		lastUsedAt: null | string,
	): Promise<void> {
		if (!this.checkIsLastUsedStale(lastUsedAt)) {
			return;
		}

		try {
			await this.apiTokenRepository.updateLastUsedAt(
				publicId,
				new Date().toISOString(),
			);
		} catch (error) {
			this.logger.error(ApiTokenLogMessage.LAST_USED_UPDATE_FAILED, {
				error,
				publicId,
			});
		}
	}

	private verifyTokenHash(token: ApiTokenEntity, inputToken: string) {
		const object = token.toAuthObject();
		const inputTokenHash = Buffer.from(this.hash(inputToken), SECRET_ENCODING);
		const storedHash = Buffer.from(object.tokenHash, SECRET_ENCODING);

		return (
			storedHash.length === inputTokenHash.length &&
			timingSafeEqual(storedHash, inputTokenHash)
		);
	}

	public async delete(publicId: string, userId: number): Promise<void> {
		const deletedCount =
			await this.apiTokenRepository.deleteByPublicIdAndUserId(publicId, userId);

		if (deletedCount === NO_ROWS_COUNT) {
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
		expiration: ApiTokenExpirationValue,
	): Promise<ApiTokenResponseDto> {
		const token = this.createToken(name, userId, expiration);
		await this.apiTokenRepository.create(ApiTokenEntity.initializeNew(token));
		return this.createTokenResponseDto(token);
	}

	public async verify(token: string): Promise<null | number> {
		const [id, inputToken] = this.stripToken(token);

		const foundToken = await this.apiTokenRepository.findByPublicId(id);
		if (!foundToken) {
			return null;
		}

		if (this.isTokenExpired(foundToken)) {
			return null;
		}

		if (!this.verifyTokenHash(foundToken, inputToken)) {
			return null;
		}

		return await this.updateLastUsedAndGetUserId(foundToken);
	}
}

export { ApiTokenService };
