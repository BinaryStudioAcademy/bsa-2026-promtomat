import { type RefObject, useEffect, useRef, useState } from "react";

import { ZERO_VALUE } from "~/libs/constants/constants.js";

import { GrowthChartConfig } from "../../constants/constants.js";
import { type ChartDimensions } from "../../types/types.js";

const DEFAULT_DIMENSIONS: ChartDimensions = {
	height: GrowthChartConfig.HEIGHT,
	width: GrowthChartConfig.WIDTH,
};

type UseChartDimensionsReturn<TElement extends Element> = {
	dimensions: ChartDimensions;
	elementReference: RefObject<null | TElement>;
};

const useChartDimensions = <
	TElement extends Element,
>(): UseChartDimensionsReturn<TElement> => {
	const elementReference = useRef<TElement>(null);
	const [dimensions, setDimensions] =
		useState<ChartDimensions>(DEFAULT_DIMENSIONS);

	useEffect(() => {
		const element = elementReference.current;

		if (!element) {
			return;
		}

		const observer = new ResizeObserver(([entry]) => {
			if (!entry) {
				return;
			}

			const { height, width } = entry.contentRect;

			if (height > ZERO_VALUE && width > ZERO_VALUE) {
				setDimensions({ height, width });
			}
		});

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, []);

	return { dimensions, elementReference };
};

export { useChartDimensions };
