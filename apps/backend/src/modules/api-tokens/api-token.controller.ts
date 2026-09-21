import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type ApiTokenRequestDto,
	type ApiTokenRouteParametersDto,
} from "~/libs/types/types.js";

import { type ApiTokenService } from "./api-token.service.js";
import { ApiTokenApiPath } from "./libs/enums/enums.js";
import {
	apiTokenCreateValidationSchema,
	apiTokenRouteParametersValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiToken:
 *       type: object
 *       properties:
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: >
 *             The moment the token stops authenticating, or null when the
 *             token never expires. A token past this moment is still listed
 *             here until it is revoked.
 *         id:
 *           type: string
 *           format: uuid
 *         lastUsedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         name:
 *           type: string
 *     ApiTokenCreated:
 *       type: object
 *       description: >
 *         The newly issued token. Deliberately narrower than ApiToken: the
 *         create response carries only what the caller needs to store.
 *       required:
 *         - id
 *         - name
 *         - value
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         value:
 *           type: string
 *           description: >
 *             The token value. Returned by this endpoint only and never
 *             recoverable afterwards, from the API or the database.
 */
class ApiTokenController extends BaseController {
	private apiTokenService: ApiTokenService;

	public constructor(logger: Logger, apiTokenService: ApiTokenService) {
		super(logger, APIPath.API_TOKENS);

		this.apiTokenService = apiTokenService;

		this.addRoute({
			handler: (options) => this.findAllByUserId(options),
			method: HTTPMethod.GET,
			path: ApiTokenApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: ApiTokenRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: ApiTokenApiPath.ROOT,
			validation: {
				body: apiTokenCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.revoke(
					options as APIHandlerOptions<{
						params: ApiTokenRouteParametersDto;
					}>,
				),
			method: HTTPMethod.DELETE,
			path: ApiTokenApiPath.REVOKE_$ID,
			validation: {
				params: apiTokenRouteParametersValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /api-tokens:
	 *   post:
	 *     description: Issues an API token and returns its value exactly once
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       description: Token name and the period it stays valid for
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - expiration
	 *               - name
	 *             properties:
	 *               expiration:
	 *                 type: integer
	 *                 enum: [0, 7, 30, 60, 90]
	 *                 description: >
	 *                   How long the token stays valid, in days. 0 means the
	 *                   token never expires and stays valid until revoked.
	 *                   Any other value is rejected.
	 *               name:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ApiTokenCreated"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       409:
	 *         description: A token with this name already exists
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
	private async create(
		options: APIHandlerOptions<{ body: ApiTokenRequestDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.apiTokenService.issue(
				options.body.name,
				options.user?.id as number,
				options.body.expiration,
			),
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /api-tokens:
	 *   get:
	 *     description: Returns the tokens issued by the authenticated user
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: "#/components/schemas/ApiToken"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 */
	private async findAllByUserId(
		options: APIHandlerOptions,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.apiTokenService.findAllByUserId(
				options.user?.id as number,
			),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /api-tokens/revoke/{id}:
	 *   delete:
	 *     description: >
	 *       Revokes one of the authenticated user's tokens. Takes effect on the
	 *       next request. A token belonging to another user is reported as not
	 *       found, so the response does not confirm which tokens exist.
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *           format: uuid
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Error"
	 *       404:
	 *         description: Token not found
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
	private async revoke(
		options: APIHandlerOptions<{ params: ApiTokenRouteParametersDto }>,
	): Promise<APIHandlerResponse> {
		await this.apiTokenService.delete(
			options.params.id,
			options.user?.id as number,
		);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}
}

export { ApiTokenController };
