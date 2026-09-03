import { type ValueOf } from "../../../../libs/types/value-of.type.js";
import { WorkspaceRole } from "../enums/workspace-role.enum.js";

type MembershipDto = {
	id: number;
	role: ValueOf<typeof WorkspaceRole>;
	userId: number;
	workspaceId: number;
};

export { type MembershipDto };
