const VECTOR_TYPE_PATTERN = /^vector\((?<dimension>\d+)\)$/;

const parseVectorDimension = (typeName: string): null | number => {
	const dimension = VECTOR_TYPE_PATTERN.exec(typeName)?.groups?.["dimension"];

	return dimension === undefined ? null : Number(dimension);
};

export { parseVectorDimension };
