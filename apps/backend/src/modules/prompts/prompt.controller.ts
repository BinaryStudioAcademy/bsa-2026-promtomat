import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { workspaceAccessHook } from "../workspaces/libs/hooks/workspace-access.hook.js";
import { type WorkspaceService } from "../workspaces/workspace.service.js";
import { PromptsApiPath } from "./libs/enums/enums.js";
import { promptAccessHook } from "./libs/hooks/prompt-access.hook.js";
import {
	type PromptCreateRequestDto,
	type PromptGetQueryDto,
	type PromptIdParameterDto,
	type PromptRouteParametersDto,
	type PromptUpdateIntentRequestDto,
	type PromptWorkspaceQueryDto,
} from "./libs/types/types.js";
import {
	promptCreateValidationSchema,
	promptGetQueryValidationSchema,
	promptIdParameterValidationSchema,
	promptRouteParametersValidationSchema,
	promptUpdateIntentValidationSchema,
	promptWorkspaceQueryValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type PromptService } from "./prompt.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         errorType:
 *           type: string
 *         message:
 *           type: string
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
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
 *         errorType:
 *           type: string
 *         message:
 *           type: string
 *     Prompt:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           minimum: 1
 *         label:
 *           type: string
 *         efficiencyScore:
 *           type: number
 *           minimum: 1
 *           maximum: 10
 *         promptBody:
 *           type: string
 *         taskIntent:
 *           type: string
 *         userId:
 *           type: number
 *         workspaceId:
 *           type: number
 *     PromptItem:
 *       type: object
 *       properties:
 *         body:
 *           type: string
 *         createdAt:
 *           type: string
 *         id:
 *           type: number
 *         intent:
 *           type: string
 *         score:
 *           type: number
 *         workspaceId:
 *           type: number
 *         workspaceName:
 *           type: string
 *     PromptGetAllResponse:
 *       type: object
 *       properties:
 *         averageScore:
 *           type: number
 *           nullable: true
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/PromptItem"
 *         page:
 *           type: number
 *         pageSize:
 *           type: number
 *         totalCount:
 *           type: number
 *     PromptRecent:
 *       type: object
 *       properties:
 *         efficiencyScore:
 *           type: number
 *         id:
 *           type: number
 *           minimum: 1
 *         taskIntent:
 *           type: string
 */
class PromptController extends BaseController {
	private promptService: PromptService;
	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		promptService: PromptService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.PROMPTS);

		this.promptService = promptService;
		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.findRecent(
					options as APIHandlerOptions<{
						query: PromptWorkspaceQueryDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.RECENT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				query: promptWorkspaceQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: PromptCreateRequestDto;
					}>,
				),
			method: HTTPMethod.POST,
			path: PromptsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				body: promptCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findAll(
					options as APIHandlerOptions<{
						query: PromptGetQueryDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService, {
				isWorkspaceOptional: true,
			}),
			validation: {
				query: promptGetQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.findById(
					options as APIHandlerOptions<{
						params: PromptIdParameterDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: PromptsApiPath.$ID,
			validation: {
				params: promptIdParameterValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.updateIntent(
					options as APIHandlerOptions<{
						body: PromptUpdateIntentRequestDto;
						params: PromptRouteParametersDto;
					}>,
				),
			method: HTTPMethod.PATCH,
			path: PromptsApiPath.$PROMPT_ID_INTENT,
			preHandler: promptAccessHook(this.promptService),
			validation: {
				body: promptUpdateIntentValidationSchema,
				params: promptRouteParametersValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /prompts:
	 *   post:
	 *     description: Creates a new prompt
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       description: Prompt data
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               efficiencyScore:
	 *                 type: number
	 *                 minimum: 1
	 *                 maximum: 10
	 *               promptBody:
	 *                 type: string
	 *               taskIntent:
	 *                 type: string
	 *               workspaceId:
	 *                 type: number
	 *     responses:
	 *       201:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Prompt"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       403:
	 *         description: You do not have permission to access this workspace
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       404:
	 *         description: Workspace not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationErrorResponse"
	 */
	private async create(
		options: APIHandlerOptions<{ body: PromptCreateRequestDto }>,
	): Promise<APIHandlerResponse> {
		const payload = {
			...options.body,
			userId: options.user?.id as number,
		};
		return {
			payload: await this.promptService.create(payload),
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /prompts:
	 *   get:
	 *     description: Returns paginated prompts list with metrics
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: page
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *       - in: query
	 *         name: limit
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *           maximum: 100
	 *       - in: query
	 *         name: search
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: score
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *           maximum: 10
	 *       - in: query
	 *         name: workspaceId
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/PromptGetAllResponse"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationErrorResponse"
	 */
	private async findAll(
		options: APIHandlerOptions<{
			query: PromptGetQueryDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findAll({
				query: options.query,
				userId: options.user?.id as number,
			}),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /prompts/{id}:
	 *    get:
	 *      description: Returns a prompt of a workspace the caller may read
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          required: true
	 *          schema:
	 *            type: number
	 *            minimum: 1
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/PromptItem"
	 *        401:
	 *          description: Unauthorized
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Error"
	 *        404:
	 *          description: Prompt not found
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/Error"
	 *        422:
	 *          description: Validation failed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: "#/components/schemas/ValidationError"
	 */
	private async findById(
		options: APIHandlerOptions<{ params: PromptIdParameterDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findById(
				options.params.id,
				options.user?.id as number,
			),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /prompts/recent:
	 *   get:
	 *     description: Returns the most recent recorded prompts for a workspace
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: workspaceId
	 *         required: true
	 *         schema:
	 *           type: number
	 *           minimum: 1
	 *         description: Workspace to list recent prompts from
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/PromptRecent"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       404:
	 *         description: Workspace not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ValidationErrorResponse"
	 */
	private async findRecent(
		options: APIHandlerOptions<{ query: PromptWorkspaceQueryDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.promptService.findRecent(options.query.workspaceId),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /prompts/{promptId}/intent:
	 *   patch:
	 *     description: Updates the intent of a prompt
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: promptId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *           minimum: 1
	 *     requestBody:
	 *       description: New prompt intent
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               taskIntent:
	 *                 type: string
	 *                 minLength: 5
	 *                 maxLength: 255
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Prompt"
	 *       401:
	 *         description: Unauthorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 errorType:
	 *                   type: string
	 *                 message:
	 *                   type: string
	 *       404:
	 *         description: Prompt not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 errorType:
	 *                   type: string
	 *                 message:
	 *                   type: string
	 *       422:
	 *         description: Validation failed
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 details:
	 *                   type: array
	 *                   items:
	 *                     type: object
	 *                     properties:
	 *                       message:
	 *                         type: string
	 *                       path:
	 *                         type: array
	 *                         items:
	 *                           type: string
	 *                 errorType:
	 *                   type: string
	 *                 message:
	 *                   type: string
	 */
	private async updateIntent(
		options: APIHandlerOptions<{
			body: PromptUpdateIntentRequestDto;
			params: PromptRouteParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		const payload = {
			...options.body,
			id: options.params.promptId,
		};

		return {
			payload: await this.promptService.updateIntent(payload),
			status: HTTPCode.OK,
		};
	}
}

export { PromptController };
