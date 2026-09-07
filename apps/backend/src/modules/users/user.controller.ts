import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";
import { type UserDto, type UserUpdateRequestDto } from "./libs/types/types.js";
import { updateProfileValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

/*** @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: number
 *            minimum: 1
 *          email:
 *            type: string
 *            format: email
 *          nickname:
 *            type: string
 *            format: string
 *          primaryAiCodingTool:
 *            type: string
 *            nullable: true
 *            enum:
 *              - CHATGPT
 *              - CLAUDE_CODE
 *              - CURSOR
 *              - GEMINI
 *              - GITHUB_COPILOT
 *              - JETBRAINS_AI
 *              - WINDSURF
 */
class UserController extends BaseController {
	private userService: UserService;

	public constructor(logger: Logger, userService: UserService) {
		super(logger, APIPath.USERS);

		this.userService = userService;

		this.addRoute({
			handler: () => this.findAll(),
			method: HTTPMethod.GET,
			path: UsersApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) =>
				this.updateProfile(
					options as APIHandlerOptions<{
						body: UserUpdateRequestDto;
					}> & { user: UserDto },
				),
			method: HTTPMethod.PATCH,
			path: UsersApiPath.ME,
			validation: {
				body: updateProfileValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /users:
	 *    get:
	 *      description: Returns an array of users
	 *      security:
	 *        - bearerAuth: []
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: array
	 *                items:
	 *                  $ref: "#/components/schemas/User"
	 */
	private async findAll(): Promise<APIHandlerResponse> {
		return {
			payload: await this.userService.findAll(),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/me:
	 *    patch:
	 *      description: Updates the profile of the authenticated user
	 *      security:
	 *        - bearerAuth: []
	 *      requestBody:
	 *        description: Profile fields to update
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                nickname:
	 *                  type: string
	 *                primaryAiCodingTool:
	 *                  type: string
	 *                  enum:
	 *                    - CHATGPT
	 *                    - CLAUDE_CODE
	 *                    - CURSOR
	 *                    - GEMINI
	 *                    - GITHUB_COPILOT
	 *                    - JETBRAINS_AI
	 *                    - WINDSURF
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/User"
	 *        401:
	 *          description: Unauthorized
	 *        409:
	 *          description: Nickname already taken
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
	private async updateProfile(
		options: APIHandlerOptions<{
			body: UserUpdateRequestDto;
		}> & { user: UserDto },
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.userService.updateProfile(
				options.user.id,
				options.body,
			),
			status: HTTPCode.OK,
		};
	}
}

export { UserController };
