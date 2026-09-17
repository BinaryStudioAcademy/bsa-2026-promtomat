import { type ValueOf } from "../../../../../../libs/types/types.js";
import { type RepositoryIdentityRefusalReason } from "../enums/enums.js";
import { type RepositoryIdentity } from "./repository-identity.type.js";

type RepositoryIdentityOutcome =
	| { identity: null; reason: ValueOf<typeof RepositoryIdentityRefusalReason> }
	| { identity: RepositoryIdentity; reason: null };

export { type RepositoryIdentityOutcome };
