import { EntityName } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

const requireEntityId = (
	id: null | number,
	entityName: ValueOf<typeof EntityName>,
): number => {
	if (id === null) {
		throw new Error(`${entityName} has no id yet - call initialize() first`);
	}

	return id;
};

export { requireEntityId };
