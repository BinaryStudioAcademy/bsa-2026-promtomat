import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { workspaceAccessHook } from "~/modules/workspaces/libs/hooks/workspace-access.hook.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

import { type LabelService } from "./label.service.js";
import { LabelsApiPath } from "./libs/enums/enums.js";
import { type GetLabelsRequestDto } from "./libs/types/types.js";
import { labelGetByQueryValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

/*** @swagger
 * components:
 *    schemas:
 *      LabelWithCount:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            minimum: 1
 *          name:
 *            type: string
 *          promptCount:
 *            type: number
 *            minimum: 0
 */
class LabelController extends BaseController {
	private labelService: LabelService;

	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		labelService: LabelService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.LABELS);

		this.labelService = labelService;
		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.findAllWithPromptCounts(
					options as APIHandlerOptions<{
						query: GetLabelsRequestDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: LabelsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService),
			validation: {
				query: labelGetByQueryValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /labels:
	 *    get:
	 *      description: Returns every label in a workspace with how many prompts carry it
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: query
	 *          name: workspaceId
	 *          required: true
	 *          schema:
	 *            type: number
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: array
	 *                items:
	 *                  $ref: "#/components/schemas/LabelWithCount"
	 */
	private async findAllWithPromptCounts(
		options: APIHandlerOptions<{ query: GetLabelsRequestDto }>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.labelService.findAllWithPromptCounts(
				options.query.workspaceId,
			),
			status: HTTPCode.OK,
		};
	}
}

export { LabelController };
