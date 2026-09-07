import { type Database } from "~/libs/modules/database/database.js";
import { type Hashing } from "~/libs/modules/hashing/hashing.js";
import { type UserRepository } from "~/modules/users/user.repository.js";
import { type WorkspaceService } from "~/modules/workspaces/workspace.service.js";

type UserServiceConstructorPayload = {
	database: Database;
	hashing: Hashing;
	userRepository: UserRepository;
	workspaceService: WorkspaceService;
};

export { type UserServiceConstructorPayload };
