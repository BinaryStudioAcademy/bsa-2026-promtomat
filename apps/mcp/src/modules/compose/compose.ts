import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { repositoryBindingApi } from "~/modules/repository-bindings/repository-bindings.js";

import { createComposeTool } from "./compose.tool.js";
import { ComposedPromptApi } from "./composed-prompt-api.js";

const composedPromptApi = new ComposedPromptApi(http);
const composePromptTool = createComposeTool(
	composedPromptApi,
	repositoryBindingApi,
	config.ENV.WEB.URL,
);

export { composePromptTool };
