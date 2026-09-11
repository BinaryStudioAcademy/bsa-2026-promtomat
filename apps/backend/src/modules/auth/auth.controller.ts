import { APIPath } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type AuthService } from "./auth.service.js";
import { AuthApiPath } from "./libs/enums/enums.js";
import { resolveThrottleKey } from "./libs/helpers/helpers.js";
import {
	type ForgotPasswordRequestDto,
	type ResetPasswordRequestDto,
	type SignInRequestDto,
	type SignUpRequestDto,
} from "./libs/types/types.js";
import {
	forgotPasswordValidationSchema,
	resetPasswordValidationSchema,
	signInValidationSchema,
	signUpValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";

class AuthController extends BaseController {
	private authService: AuthService;

	public constructor(logger: Logger, authService: AuthService) {
		super(logger, APIPath.AUTH);

		this.authService = authService;

		this.addRoute({
			handler: (options) => this.getAuthenticatedUser(options),
			method: HTTPMethod.GET,
			path: AuthApiPath.AUTHENTICATED_USER,
		});

		this.addRoute({
			handler: (options) =>
				this.signIn(
					options as APIHandlerOptions<{
						body: SignInRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: AuthApiPath.SIGN_IN,
			validation: {
				body: signInValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.signUp(
					options as APIHandlerOptions<{
						body: SignUpRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: AuthApiPath.SIGN_UP,
			validation: {
				body: signUpValidationSchema,
			},
		});

		this.addRoute({
			config: {
				rateLimit: {
					keyGenerator: resolveThrottleKey,
					max: config.ENV.PASSWORD_RESET.REQUEST_LIMIT,
					timeWindow: `${config.ENV.PASSWORD_RESET.WINDOW_MINUTES.toString()} minutes`,
				},
			},
			handler: (options) =>
				this.forgotPassword(
					options as APIHandlerOptions<{
						body: ForgotPasswordRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: AuthApiPath.FORGOT_PASSWORD,
			validation: {
				body: forgotPasswordValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.resetPassword(
					options as APIHandlerOptions<{
						body: ResetPasswordRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: AuthApiPath.RESET_PASSWORD,
			validation: {
				body: resetPasswordValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /auth/forgot-password:
	 *   post:
	 *     description: >
	 *       Requests a password reset link. Responds identically whether or not
	 *       the address belongs to a registered account, so the endpoint cannot
	 *       be used to discover which emails are registered.
	 *     requestBody:
	 *       description: The address to send the reset link to
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 format: email
	 *     responses:
	 *       202:
	 *         description: >
	 *           Request accepted. A link is sent only if the address is
	 *           registered; the response is the same either way.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               nullable: true
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */
	private forgotPassword(
		options: APIHandlerOptions<{ body: ForgotPasswordRequestDto }>,
	): APIHandlerResponse {
		this.authService.requestPasswordReset(options.body);

		return {
			payload: null,
			status: HTTPCode.ACCEPTED,
		};
	}

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Error:
	 *       type: object
	 *       properties:
	 *         code:
	 *           type: string
	 *           enum:
	 *             - AUTH_EMAIL_ALREADY_EXISTS
	 *             - AUTH_INVALID_CREDENTIALS
	 * 			   - AUTH_NICKNAME_ALREADY_EXISTS
	 *             - FORBIDDEN
	 *             - INTERNAL_SERVER_ERROR
	 *             - NOT_FOUND
	 *             - UNAUTHENTICATED
	 *             - VALIDATION_FAILED
	 *         message:
	 *           type: string
	 *     ValidationError:
	 *       type: object
	 *       properties:
	 *         code:
	 *           type: string
	 *           enum:
	 *             - VALIDATION_FAILED
	 *         message:
	 *           type: string
	 *         details:
	 *           type: array
	 *           items:
	 *             type: object
	 *             properties:
	 *               message:
	 *                 type: string
	 *               path:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 * /auth/authenticated-user:
	 *   get:
	 *     description: Returns the authenticated user
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/User"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 */
	private getAuthenticatedUser(options: APIHandlerOptions): APIHandlerResponse {
		return {
			payload: options.user,
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /auth/reset-password:
	 *   post:
	 *     description: Sets a new password using a token from a reset email.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               password:
	 *                 type: string
	 *               token:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Password changed. The token cannot be used again.
	 *       422:
	 *         description: >
	 *           Validation failed, or the token is expired
	 *           (AUTH_RESET_TOKEN_EXPIRED) or no longer valid
	 *           (AUTH_RESET_TOKEN_INVALID).
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 */
	private async resetPassword(
		options: APIHandlerOptions<{ body: ResetPasswordRequestDto }>,
	): Promise<APIHandlerResponse> {
		await this.authService.resetPassword(options.body);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /auth/sign-in:
	 *   post:
	 *     description: Sign in user into the system
	 *     requestBody:
	 *       description: User auth data
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 format: email
	 *               password:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 token:
	 *                   type: string
	 *                 user:
	 *                   $ref: "#/components/schemas/User"
	 *       401:
	 *         description: Invalid email or password
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 */
	private async signIn(
		options: APIHandlerOptions<{ body: SignInRequestDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.authService.signIn(options.body),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /auth/sign-up:
	 *   post:
	 *     description: Sign up user into the system
	 *     requestBody:
	 *       description: User auth data
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 format: email
	 *               password:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 token:
	 *                   type: string
	 *                 user:
	 *                   $ref: "#/components/schemas/User"
	 *       409:
	 *         description: User with this email already exists
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationError"
	 *
	 *
	 */
	private async signUp(
		options: APIHandlerOptions<{
			body: SignUpRequestDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.authService.signUp(options.body),
			status: HTTPCode.CREATED,
		};
	}
}

export { AuthController };
