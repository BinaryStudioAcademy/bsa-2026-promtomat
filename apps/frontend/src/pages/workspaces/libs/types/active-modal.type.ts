import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

type ActiveModal =
	| null
	| { isOwner: boolean; type: "config"; workspace: WorkspaceListItemDto }
	| { type: "create" };

export { type ActiveModal };
