import { type ValueOf } from "@promptomat/shared";

import { type AppRoute } from "~/libs/enums/enums.js";

type NavigableRoute = Exclude<ValueOf<typeof AppRoute>, typeof AppRoute.ANY>;

export { type NavigableRoute };
