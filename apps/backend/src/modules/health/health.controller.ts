import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { HealthApiPath } from "./libs/enums/enums.js";

class HealthController extends BaseController {
	public constructor(logger: Logger) {
		super(logger, APIPath.HEALTH);

		this.addRoute({
			handler: () => this.check(),
			method: "GET",
			path: HealthApiPath.ROOT,
		});
	}

	/**
	 * @swagger
	 * /health:
	 *    get:
	 *      description: Health check endpoint
	 *      responses:
	 *        200:
	 *          description: Service is healthy
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  ok:
	 *                    type: boolean
	 *                    example: true
	 */
	private check(): APIHandlerResponse {
		return {
			payload: { ok: true },
			status: HTTPCode.OK,
		};
	}
}

export { HealthController };
