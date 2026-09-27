import { type RepositoryIdentity } from "@promptomat/shared";

type RepositoryBindingCreatePayload = {
	identity: RepositoryIdentity;
	workspaceId: number;
};

export { type RepositoryBindingCreatePayload };
