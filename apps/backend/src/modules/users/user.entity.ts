import { type Entity } from "~/libs/types/types.js";

import { type PrimaryAiCodingTool, type UserDto } from "./libs/types/types.js";

class UserEntity implements Entity {
	private createdAt: null | string;

	private email: string;

	private id: null | number;

	private nickname: string;

	private passwordHash: string;

	private passwordSalt: string;

	private primaryAiCodingTool: null | PrimaryAiCodingTool;

	private constructor({
		createdAt,
		email,
		id,
		nickname,
		passwordHash,
		passwordSalt,
		primaryAiCodingTool,
	}: {
		createdAt: null | string;
		email: string;
		id: null | number;
		nickname: string;
		passwordHash: string;
		passwordSalt: string;
		primaryAiCodingTool: null | PrimaryAiCodingTool;
	}) {
		this.id = id;
		this.createdAt = createdAt;
		this.email = email;
		this.nickname = nickname;
		this.passwordHash = passwordHash;
		this.passwordSalt = passwordSalt;
		this.primaryAiCodingTool = primaryAiCodingTool;
	}

	public static initialize({
		createdAt,
		email,
		id,
		nickname,
		passwordHash,
		passwordSalt,
		primaryAiCodingTool,
	}: {
		createdAt: string;
		email: string;
		id: number;
		nickname: string;
		passwordHash: string;
		passwordSalt: string;
		primaryAiCodingTool: null | PrimaryAiCodingTool;
	}): UserEntity {
		return new UserEntity({
			createdAt,
			email,
			id,
			nickname,
			passwordHash,
			passwordSalt,
			primaryAiCodingTool,
		});
	}

	public static initializeNew({
		email,
		nickname,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		nickname: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			createdAt: null,
			email,
			id: null,
			nickname,
			passwordHash,
			passwordSalt,
			primaryAiCodingTool: null,
		});
	}

	public toAuthObject(): {
		email: string;
		id: number;
		passwordHash: string;
		passwordSalt: string;
	} {
		return {
			email: this.email,
			id: this.id as number,
			passwordHash: this.passwordHash,
			passwordSalt: this.passwordSalt,
		};
	}

	public toNewObject(): {
		email: string;
		nickname: string;
		passwordHash: string;
		passwordSalt: string;
		primaryAiCodingTool: null | PrimaryAiCodingTool;
	} {
		return {
			email: this.email,
			nickname: this.nickname,
			passwordHash: this.passwordHash,
			passwordSalt: this.passwordSalt,
			primaryAiCodingTool: this.primaryAiCodingTool,
		};
	}

	public toObject(): UserDto {
		return {
			email: this.email,
			id: this.id as number,
			nickname: this.nickname,
			primaryAiCodingTool: this.primaryAiCodingTool,
		};
	}

	public toProfileSummaryObject(): {
		createdAt: string;
		nickname: string;
		primaryAiCodingTool: null | PrimaryAiCodingTool;
	} {
		return {
			createdAt: this.createdAt as string,
			nickname: this.nickname,
			primaryAiCodingTool: this.primaryAiCodingTool,
		};
	}
}

export { UserEntity };
