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

import { type AnalyticsService } from "./analytics.service.js";
import { AnalyticsApiPath } from "./libs/enums/enums.js";
import {
	type AnalyticsDashboardResponseDto,
	type AnalyticsQueryDto,
} from "./libs/types/types.js";
import { analyticsQueryValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AnalyticsDashboard:
 *       type: object
 *       properties:
 *         distribution:
 *           type: object
 *         growth:
 *           type: object
 *         keywords:
 *           type: object
 */
class AnalyticsController extends BaseController {
	private analyticsService: AnalyticsService;

	private workspaceService: WorkspaceService;

	public constructor(
		logger: Logger,
		analyticsService: AnalyticsService,
		workspaceService: WorkspaceService,
	) {
		super(logger, APIPath.ANALYTICS);

		this.analyticsService = analyticsService;
		this.workspaceService = workspaceService;

		this.addRoute({
			handler: (options) =>
				this.findDashboard(
					options as APIHandlerOptions<{
						query: AnalyticsQueryDto;
					}>,
				),
			method: HTTPMethod.GET,
			path: AnalyticsApiPath.ROOT,
			preHandler: workspaceAccessHook(this.workspaceService, {
				isWorkspaceOptional: true,
			}),
			validation: {
				query: analyticsQueryValidationSchema,
			},
		});
	}

	/**
	 * @swagger
	 * /analytics:
	 *   get:
	 *     description: Returns the distribution, growth, and keyword-weight charts for the dashboard
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: workspaceId
	 *         required: false
	 *         schema:
	 *           type: number
	 *           minimum: 1
	 *       - in: query
	 *         name: granularity
	 *         required: false
	 *         schema:
	 *           type: string
	 *           enum: [day, week, month]
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/AnalyticsDashboard"
	 */
	private async findDashboard(
		options: APIHandlerOptions<{ query: AnalyticsQueryDto }>,
	): Promise<APIHandlerResponse> {
		const { granularity, workspaceId } = options.query;
		const userId = options.user?.id as number;

		const [distribution, growth, keywords] = await Promise.all([
			this.analyticsService.findDistribution({ userId, workspaceId }),
			this.analyticsService.findGrowth({ granularity, userId, workspaceId }),
			this.analyticsService.findKeywordWeights({ userId, workspaceId }),
		]);

		const payload: AnalyticsDashboardResponseDto = {
			distribution,
			growth,
			keywords,
		};

		return {
			payload,
			status: HTTPCode.OK,
		};
	}
}

export { AnalyticsController };
