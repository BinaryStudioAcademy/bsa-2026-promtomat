import { type ValueOf } from "~/libs/types/types.js";

import { ApiTokenExpiration } from "../enums/enums.js";

type ApiTokenExpirationValue = ValueOf<typeof ApiTokenExpiration>;

export { ApiTokenExpirationValue };
