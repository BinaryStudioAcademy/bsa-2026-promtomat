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
import { type UserDto } from "./libs/types/types.js";

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
			handler: (options) => this.getProfileSummary(options),
			method: HTTPMethod.GET,
			path: UsersApiPath.ME_SUMMARY,
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
	 * /users/me/summary:
	 *    get:
	 *      description: Returns the authenticated user's profile summary
	 *      security:
	 *        - bearerAuth: []
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  nickname:
	 *                    type: string
	 *                  primaryAiCodingTool:
	 *                    type: string
	 *                    nullable: true
	 *                  memberSince:
	 *                    type: string
	 *                    format: date-time
	 *                  totalPrompts:
	 *                    type: number
	 *                  averageScore:
	 *                    type: number
	 *                    nullable: true
	 *        401:
	 *          description: Unauthorized
	 */
	private getProfileSummary(options: APIHandlerOptions): APIHandlerResponse {
		return {
			payload: this.userService.getProfileSummary(options.user as UserDto),
			status: HTTPCode.OK,
		};
	}
}

export { UserController };
