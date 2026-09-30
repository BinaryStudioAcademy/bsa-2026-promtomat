import { workspaceUpdateValidationSchema } from "~/modules/workspaces/workspaces.js";

const workspaceEditableFields = workspaceUpdateValidationSchema.required();

export { workspaceEditableFields };
