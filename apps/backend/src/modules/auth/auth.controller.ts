import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type AuthService } from "./auth.service.js";
import { AuthApiPath } from "./libs/enums/enums.js";
import {
	type SignInRequestDto,
	type SignUpRequestDto,
} from "./libs/types/types.js";
import {
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
	 *             - AUTH_NICKNAME_ALREADY_EXISTS
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
