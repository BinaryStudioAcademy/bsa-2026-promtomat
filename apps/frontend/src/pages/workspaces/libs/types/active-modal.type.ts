import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

type ActiveModal =
	| null
	| { type: "config"; workspace: WorkspaceListItemDto }
	| { type: "create" }
	| { type: "delete"; workspace: WorkspaceListItemDto };

export { type ActiveModal };
