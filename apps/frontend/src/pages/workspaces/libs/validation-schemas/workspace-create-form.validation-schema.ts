import { workspaceCreationValidationSchema } from "~/modules/workspaces/workspaces.js";

const workspaceCreateForm = workspaceCreationValidationSchema.required();

export { workspaceCreateForm };
