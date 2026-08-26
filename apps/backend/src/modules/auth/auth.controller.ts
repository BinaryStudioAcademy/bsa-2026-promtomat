import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type AuthPayload } from "~/libs/modules/server-application/libs/types/types.js";

import { type AuthService } from "./auth.service.js";
import { AuthApiPath } from "./libs/enums/enums.js";
import { type SignUpRequestDto } from "./libs/types/types.js";
import { signUpValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

class AuthController extends BaseController {
	private authService: AuthService;

	public constructor(logger: Logger, authService: AuthService) {
		super(logger, APIPath.AUTH);

		this.authService = authService;

		this.addRoute({
			handler: (options) => this.getAuthenticatedUser(options),
			isProtected: true,
			method: HTTPMethod.GET,
			path: AuthApiPath.AUTHENTICATED_USER,
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
	 * /auth/authenticated-user:
	 *    get:
	 *      description: Returns the authenticated user
	 *      security:
	 *        - bearerAuth: []
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/User"
	 *        401:
	 *          description: Unauthorized
	 */
	private async getAuthenticatedUser(
		options: APIHandlerOptions,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.authService.getAuthenticatedUser(
				(options.user as AuthPayload).userId,
			),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /auth/sign-up:
	 *    post:
	 *      description: Sign up user into the system
	 *      requestBody:
	 *        description: User auth data
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                email:
	 *                  type: string
	 *                  format: email
	 *                password:
	 *                  type: string
	 *      responses:
	 *        201:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  token:
	 *                    type: string
	 *                  user:
	 *                    $ref: "#/components/schemas/User"
	 *        409:
	 *          description: User with this email already exists
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  errorType:
	 *                    type: string
	 *                  message:
	 *                    type: string
	 *        422:
	 *          description: Validation failed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  details:
	 *                    type: array
	 *                    items:
	 *                      type: object
	 *                      properties:
	 *                        message:
	 *                          type: string
	 *                        path:
	 *                          type: array
	 *                          items:
	 *                            type: string
	 *                  errorType:
	 *                    type: string
	 *                  message:
	 *                    type: string
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
