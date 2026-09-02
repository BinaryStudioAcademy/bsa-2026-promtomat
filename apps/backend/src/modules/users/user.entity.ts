import { type Entity } from "~/libs/types/types.js";

class UserEntity implements Entity {
	private email: string;

	private id: null | number;

	private nickname: string;

	private passwordHash: string;

	private passwordSalt: string;

	private constructor({
		email,
		id,
		nickname,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		id: null | number;
		nickname: string;
		passwordHash: string;
		passwordSalt: string;
	}) {
		this.id = id;
		this.email = email;
		this.nickname = nickname;
		this.passwordHash = passwordHash;
		this.passwordSalt = passwordSalt;
	}

	public static initialize({
		email,
		id,
		nickname,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		id: number;
		nickname: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			email,
			id,
			nickname,
			passwordHash,
			passwordSalt,
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
			email,
			id: null,
			nickname,
			passwordHash,
			passwordSalt,
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
	} {
		return {
			email: this.email,
			nickname: this.nickname,
			passwordHash: this.passwordHash,
			passwordSalt: this.passwordSalt,
		};
	}

	public toObject(): {
		email: string;
		id: number;
		nickname: string;
	} {
		return {
			email: this.email,
			id: this.id as number,
			nickname: this.nickname,
		};
	}
}

export { UserEntity };
