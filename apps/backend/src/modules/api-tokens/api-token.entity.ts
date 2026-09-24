import { type ApiTokenDto, type Entity } from "~/libs/types/types.js";

class ApiTokenEntity implements Entity {
	private expiresAt: null | string;

	private lastUsedAt: null | string;

	private name: string;

	private publicId: null | string;

	private tokenHash: string;

	private userId: number;

	private constructor({
		expiresAt,
		lastUsedAt,
		name,
		publicId,
		tokenHash,
		userId,
	}: {
		expiresAt: null | string;
		lastUsedAt: null | string;
		name: string;
		publicId: null | string;
		tokenHash: string;
		userId: number;
	}) {
		this.publicId = publicId;
		this.userId = userId;
		this.name = name;
		this.lastUsedAt = lastUsedAt;
		this.tokenHash = tokenHash;
		this.expiresAt = expiresAt;
	}

	public static initialize({
		expiresAt,
		lastUsedAt,
		name,
		publicId,
		tokenHash,
		userId,
	}: {
		expiresAt: null | string;
		lastUsedAt: null | string;
		name: string;
		publicId: string;
		tokenHash: string;
		userId: number;
	}): ApiTokenEntity {
		return new ApiTokenEntity({
			expiresAt,
			lastUsedAt,
			name,
			publicId,
			tokenHash,
			userId,
		});
	}

	public static initializeNew({
		expiresAt,
		name,
		publicId,
		tokenHash,
		userId,
	}: {
		expiresAt: null | string;
		name: string;
		publicId: string;
		tokenHash: string;
		userId: number;
	}): ApiTokenEntity {
		return new ApiTokenEntity({
			expiresAt,
			lastUsedAt: null,
			name,
			publicId,
			tokenHash,
			userId,
		});
	}

	public toAuthObject(): {
		lastUsedAt: null | string;
		publicId: string;
		tokenHash: string;
		userId: number;
	} {
		return {
			lastUsedAt: this.lastUsedAt,
			publicId: this.publicId as string,
			tokenHash: this.tokenHash,
			userId: this.userId,
		};
	}

	public toNewObject(): {
		expiresAt: null | string;
		lastUsedAt: null | string;
		name: string;
		publicId: string;
		tokenHash: string;
		userId: number;
	} {
		return {
			expiresAt: this.expiresAt,
			lastUsedAt: this.lastUsedAt,
			name: this.name,
			publicId: this.publicId as string,
			tokenHash: this.tokenHash,
			userId: this.userId,
		};
	}

	public toObject(): ApiTokenDto {
		return {
			expiresAt: this.expiresAt,
			id: this.publicId as string,
			lastUsedAt: this.lastUsedAt,
			name: this.name,
		};
	}
}

export { ApiTokenEntity };
