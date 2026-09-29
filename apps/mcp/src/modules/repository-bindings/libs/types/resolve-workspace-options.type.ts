import { type RepositoryBindingApi } from "../../repository-binding-api.js";

type ResolveWorkspaceOptions = {
	projectDirectory: string;
	remoteName?: string | undefined;
	repositoryBindingApi: RepositoryBindingApi;
};

export { type ResolveWorkspaceOptions };
