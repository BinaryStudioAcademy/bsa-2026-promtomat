import { MembershipModel } from "./membership.model.js";
import { MembershipRepository } from "./membership.repository.js";
import { MembershipService } from "./membership.service.js";

const membershipRepository = new MembershipRepository(MembershipModel);
const membershipService = new MembershipService(membershipRepository);

export { membershipService };
