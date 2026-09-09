import { type Entity } from "~/libs/types/types.js";

class PasswordResetEntity implements Entity {
	private expiresAt: Date;

	private id: null | number;

	private tokenHash: string;

	private userId: number;

	private constructor({
		expiresAt,
		id,
		tokenHash,
		userId,
	}: {
		expiresAt: Date | string;
		id: null | number;
		tokenHash: string;
		userId: number;
	}) {
		const parsedExpiresAt = new Date(expiresAt);

		if (Number.isNaN(parsedExpiresAt.getTime())) {
			throw new TypeError("Password reset token expiry is not a valid date.");
		}

		this.expiresAt = parsedExpiresAt;
		this.id = id;
		this.tokenHash = tokenHash;
		this.userId = userId;
	}

	public static initialize({
		expiresAt,
		id,
		tokenHash,
		userId,
	}: {
		expiresAt: Date | string;
		id: number;
		tokenHash: string;
		userId: number;
	}): PasswordResetEntity {
		return new PasswordResetEntity({
			expiresAt,
			id,
			tokenHash,
			userId,
		});
	}

	public static initializeNew({
		expiresAt,
		tokenHash,
		userId,
	}: {
		expiresAt: Date | string;
		tokenHash: string;
		userId: number;
	}): PasswordResetEntity {
		return new PasswordResetEntity({
			expiresAt,
			id: null,
			tokenHash,
			userId,
		});
	}

	public toNewObject(): {
		expiresAt: Date;
		tokenHash: string;
		userId: number;
	} {
		return {
			expiresAt: this.expiresAt,
			tokenHash: this.tokenHash,
			userId: this.userId,
		};
	}

	public toObject(): {
		expiresAt: Date;
		id: number;
		tokenHash: string;
		userId: number;
	} {
		if (this.id === null) {
			throw new Error("Cannot serialise an unsaved password reset token.");
		}

		return {
			expiresAt: this.expiresAt,
			id: this.id,
			tokenHash: this.tokenHash,
			userId: this.userId,
		};
	}
}

export { PasswordResetEntity };
