import { AuthError } from "~/libs/exceptions/exceptions.js";
import { type Hashing } from "~/libs/modules/hashing/hashing.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type MailService } from "~/libs/modules/mail/mail.js";
import { type RateLimitService } from "~/libs/modules/rate-limit/rate-limit.js";
import { type TokenService } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";

import {
	createPasswordResetToken,
	hashPasswordResetToken,
	hashThrottleKey,
} from "./libs/helpers/helpers.js";
import {
	type ForgotPasswordRequestDto,
	type ResetPasswordRequestDto,
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
} from "./libs/types/types.js";
import { PasswordResetEntity } from "./password-reset.entity.js";
import { type PasswordResetRepository } from "./password-reset.repository.js";

const MILLISECONDS_IN_MINUTE = 60_000;

const PASSWORD_RESET_SUBJECT = "Reset your Promptomat password";

type Constructor = {
	hashing: Hashing;
	linkBaseUrl: string;
	logger: Logger;
	mailService: MailService;
	passwordResetRepository: PasswordResetRepository;
	rateLimitService: RateLimitService;
	tokenService: TokenService;
	tokenTtlMinutes: number;
	userService: UserService;
};

class AuthService {
	private hashing: Hashing;

	private linkBaseUrl: string;

	private logger: Logger;

	private mailService: MailService;

	private passwordResetRepository: PasswordResetRepository;

	private rateLimitService: RateLimitService;

	private tokenService: TokenService;

	private tokenTtlMinutes: number;

	private userService: UserService;

	public constructor({
		hashing,
		linkBaseUrl,
		logger,
		mailService,
		passwordResetRepository,
		rateLimitService,
		tokenService,
		tokenTtlMinutes,
		userService,
	}: Constructor) {
		this.hashing = hashing;
		this.linkBaseUrl = linkBaseUrl;
		this.logger = logger;
		this.mailService = mailService;
		this.passwordResetRepository = passwordResetRepository;
		this.rateLimitService = rateLimitService;
		this.tokenService = tokenService;
		this.tokenTtlMinutes = tokenTtlMinutes;
		this.userService = userService;
	}

	private async deliverResetLink(email: string, token: string): Promise<void> {
		const link = `${this.linkBaseUrl}?token=${token}`;

		try {
			await this.mailService.send({
				subject: PASSWORD_RESET_SUBJECT,
				text: `Open this link to choose a new password. It expires in ${this.tokenTtlMinutes.toString()} minutes.\n\n${link}\n\nIf you did not ask for this, you can ignore this email.`,
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
			const token = createPasswordResetToken();
			const expiresAt = new Date(
				Date.now() + this.tokenTtlMinutes * MILLISECONDS_IN_MINUTE,
			);

			await this.passwordResetRepository.create(
				PasswordResetEntity.initializeNew({
					expiresAt,
					tokenHash: hashPasswordResetToken(token),
					userId: id,
				}),
			);

			await this.deliverResetLink(email, token);
		} catch (error) {
			this.logger.error("Failed to issue a password reset token.", {
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	public requestPasswordReset({ email }: ForgotPasswordRequestDto): void {
		if (!this.rateLimitService.consume(hashThrottleKey(email))) {
			return;
		}

		void this.issueResetToken(email);
	}

	public async resetPassword({
		password,
		token,
	}: ResetPasswordRequestDto): Promise<void> {
		const tokenEntity = await this.passwordResetRepository.findByTokenHash(
			hashPasswordResetToken(token),
		);

		if (!tokenEntity) {
			throw AuthError.resetTokenInvalid();
		}

		const { expiresAt, id, userId } = tokenEntity.toObject();

		if (expiresAt <= new Date()) {
			await this.passwordResetRepository.delete(id);

			throw AuthError.resetTokenExpired();
		}

		const isClaimed = await this.passwordResetRepository.delete(id);

		if (!isClaimed) {
			throw AuthError.resetTokenInvalid();
		}

		await this.userService.updatePassword(userId, password);
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
