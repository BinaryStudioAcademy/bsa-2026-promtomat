import { z } from "zod";

import { workspaceGetByQuery } from "../validation-schemas/workspace-get-by-query.validation-schema.js";

type WorkspaceGetAllRequestDto = z.infer<typeof workspaceGetByQuery>;

export { type WorkspaceGetAllRequestDto };
