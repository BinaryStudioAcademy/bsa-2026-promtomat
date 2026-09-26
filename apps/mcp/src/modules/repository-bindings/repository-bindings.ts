import { http } from "~/libs/modules/http/http.js";

import { createBindRepositoryTool } from "./bind-repository.tool.js";
import { RepositoryBindingApi } from "./repository-binding-api.js";
import { createResolveRepositoryTool } from "./resolve-repository.tool.js";

const repositoryBindingApi = new RepositoryBindingApi(http);
const bindRepositoryTool = createBindRepositoryTool(repositoryBindingApi);
const resolveRepositoryTool = createResolveRepositoryTool(repositoryBindingApi);

export { bindRepositoryTool, resolveRepositoryTool };
