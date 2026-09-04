import { VECTOR_TYPE_PATTERN } from "../constants/constants.js";

const parseVectorDimension = (typeName: string): null | number => {
	const dimension = VECTOR_TYPE_PATTERN.exec(typeName)?.groups?.["dimension"];

	return dimension === undefined ? null : Number(dimension);
};

export { parseVectorDimension };
