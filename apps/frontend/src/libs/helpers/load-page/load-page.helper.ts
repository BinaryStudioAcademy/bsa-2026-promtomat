import { type ComponentType, lazy, type LazyExoticComponent } from "react";

const loadPage = <TName extends string>(
	importer: () => Promise<Record<TName, ComponentType>>,
	exportName: TName,
): LazyExoticComponent<ComponentType> => {
	return lazy(async () => {
		const pageModule = await importer();

		return { default: pageModule[exportName] };
	});
};

export { loadPage };
