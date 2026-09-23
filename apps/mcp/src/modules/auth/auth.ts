import { http } from "~/libs/modules/http/http.js";

import { AuthApi } from "./auth-api.js";
import { createWhoAmITool } from "./whoami.tool.js";

const authApi = new AuthApi(http);
const whoAmITool = createWhoAmITool(authApi);

export { whoAmITool };
