import { type ErrorCode } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type BaseQueryExtraOptions = {
	suppressToast?: boolean;
	suppressToastFor?: ValueOf<typeof ErrorCode>[];
};

export { type BaseQueryExtraOptions };
