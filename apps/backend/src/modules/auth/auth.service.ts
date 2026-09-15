import { MILLISECONDS_IN_SECOND } from "~/libs/constants/constants.js";
import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type Hashing } from "~/libs/modules/hashing/hashing.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type MailService } from "~/libs/modules/mail/mail.js";
import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	PASSWORD_CHANGED_SUBJECT,
	PASSWORD_CHANGED_TEXT,
	PASSWORD_RESET_SUBJECT,
} from "./libs/constants/constants.js";
import { TokenPurpose } from "./libs/enums/enums.js";
import {
	buildPasswordResetText,
	checkHasResetTokenClaims,
	checkIsExpiredTokenError,
} from "./libs/helpers/helpers.js";
import {
	type ForgotPasswordRequestDto,
	type PasswordResetTokenClaims,
	type PasswordResetTokenPayload,
	type ResetPasswordRequestDto,
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
	type VerifiedResetToken,
} from "./libs/types/types.js";

type Constructor = {
	hashing: Hashing;
	linkBaseUrl: string;
	logger: Logger;
	mailService: MailService;
	tokenService: TokenService;
	tokenTtlMinutes: number;
	userService: UserService;
};

class AuthService {
	private hashing: Hashing;

	private linkBaseUrl: string;

	private logger: Logger;

	private mailService: MailService;

	private tokenService: TokenService;

	private tokenTtlMinutes: number;

	private userService: UserService;

	public constructor({
		hashing,
		linkBaseUrl,
		logger,
		mailService,
		tokenService,
		tokenTtlMinutes,
		userService,
	}: Constructor) {
		this.hashing = hashing;
		this.linkBaseUrl = linkBaseUrl;
		this.logger = logger;
		this.mailService = mailService;
		this.tokenService = tokenService;
		this.tokenTtlMinutes = tokenTtlMinutes;
		this.userService = userService;
	}

	private async deliverPasswordChangedNotice(userId: number): Promise<void> {
		try {
			const user = await this.userService.findById(userId);

			if (!user) {
				return;
			}

			await this.mailService.send({
				subject: PASSWORD_CHANGED_SUBJECT,
				text: PASSWORD_CHANGED_TEXT,
				to: user.email,
			});
		} catch (error) {
			this.logger.error("Failed to deliver a password changed notice.", {
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	private async deliverResetLink(email: string, token: string): Promise<void> {
		const link = `${this.linkBaseUrl}?token=${token}`;

		try {
			await this.mailService.send({
				subject: PASSWORD_RESET_SUBJECT,
				text: buildPasswordResetText(link, this.tokenTtlMinutes),
				to: email,
			});
		} catch (error) {
			this.logger.error("Failed to deliver a password reset email.", {
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	private async issueResetToken(email: string): Promise<void> {
		try {
			const userEntity = await this.userService.findByEmail(email);

			if (!userEntity) {
				return;
			}

			const { id } = userEntity.toObject();
			const token = await this.tokenService.create<PasswordResetTokenPayload>(
				{
					purpose: TokenPurpose.PASSWORD_RESET,
					userId: id,
				},
				{ expiresIn: `${this.tokenTtlMinutes.toString()}m` },
			);

			await this.deliverResetLink(email, token);
		} catch (error) {
			this.logger.error("Failed to issue a password reset token.", {
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	private async verifyResetToken(token: string): Promise<VerifiedResetToken> {
		let claims: PasswordResetTokenClaims;

		try {
			claims = await this.tokenService.verify<PasswordResetTokenClaims>(token);
		} catch (error) {
			if (checkIsExpiredTokenError(error)) {
				throw AuthError.resetTokenExpired();
			}

			throw AuthError.resetTokenInvalid();
		}

		if (!checkHasResetTokenClaims(claims)) {
			throw AuthError.resetTokenInvalid();
		}

		return {
			issuedAt: new Date(claims.iat * MILLISECONDS_IN_SECOND),
			userId: claims.userId,
		};
	}

	public requestPasswordReset({ email }: ForgotPasswordRequestDto): void {
		void this.issueResetToken(email);
	}

	public async resetPassword({
		password,
		token,
	}: ResetPasswordRequestDto): Promise<void> {
		const { issuedAt, userId } = await this.verifyResetToken(token);

		const isClaimed = await this.userService.updatePasswordForReset(
			userId,
			password,
			issuedAt,
		);

		if (!isClaimed) {
			throw AuthError.resetTokenInvalid();
		}

		void this.deliverPasswordChangedNotice(userId);
	}

	public async signIn(
		userRequestDto: SignInRequestDto,
	): Promise<SignInResponseDto> {
		const userEntity = await this.userService.findByEmail(userRequestDto.email);

		if (!userEntity) {
			await this.hashing.hash(userRequestDto.password);
			throw AuthError.invalidCredentials();
		}

		const userAuth = userEntity.toAuthObject();
		const isValidPassword = await this.hashing.verify({
			data: userRequestDto.password,
			hash: userAuth.passwordHash,
			salt: userAuth.passwordSalt,
		});

		if (!isValidPassword) {
			throw AuthError.invalidCredentials();
		}

		const user = userEntity.toObject();

		const token = await this.tokenService.create({
			userId: user.id,
		});

		return {
			token,
			user,
		};
	}

	public async signUp(
		signUpRequestDto: SignUpRequestDto,
	): Promise<SignUpResponseDto> {
		const user = await this.userService.create(signUpRequestDto);

		const token = await this.tokenService.create({
			userId: user.id,
		});

		return {
			token,
			user,
		};
	}
}

export { AuthService };
