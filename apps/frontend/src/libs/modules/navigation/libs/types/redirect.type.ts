import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type Redirect = {
	replace: boolean;
	to: ValueOf<typeof AppRoute>;
};

export { type Redirect };
