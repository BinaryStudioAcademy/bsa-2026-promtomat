import React, { useId, useMemo } from "react";

import { FIRST_ELEMENT_INDEX } from "~/libs/constants/constants.js";
import {
	type AnalyticsGranularity,
	type AnalyticsGrowthPoint,
} from "~/modules/analytics/libs/types/types.js";

import {
	LAST_ELEMENT_INDEX,
	SCORE_FRACTION_DIGITS,
} from "../../libs/constants/constants.js";
import { GrowthChartConfig } from "../../libs/enums/enums.js";
import { buildAreaPath } from "../../libs/helpers/build-area-path.helper.js";
import { buildLinePath } from "../../libs/helpers/build-line-path.helper.js";
import { getGrowthDescription } from "../../libs/helpers/get-growth-description.helper.js";
import { getPlotX } from "../../libs/helpers/get-plot-x.helper.js";
import { getPlotY } from "../../libs/helpers/get-plot-y.helper.js";
import { getXAxisLabel } from "../../libs/helpers/get-x-axis-label.helper.js";
import { getYAxis } from "../../libs/helpers/get-y-axis.helper.js";
import { splitIntoSeries } from "../../libs/helpers/split-into-series.helper.js";
import { useChartDimensions } from "../../libs/hooks/use-chart-dimensions/use-chart-dimensions.hook.js";
import { type GrowthSummary } from "../../libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	granularity: AnalyticsGranularity;
	points: AnalyticsGrowthPoint[];
	summary: GrowthSummary;
};

const GrowthChart: React.FC<Properties> = ({
	granularity,
	points,
	summary,
}: Properties) => {
	const gradientId = useId().replaceAll(":", "");
	const { dimensions, elementReference } = useChartDimensions<SVGSVGElement>();

	const plotBounds = useMemo(
		() => ({
			plotBottom: dimensions.height - GrowthChartConfig.PADDING_BOTTOM,
			plotRight: dimensions.width - GrowthChartConfig.PADDING_RIGHT,
		}),
		[dimensions.height, dimensions.width],
	);

	const { axis, dots, lineSeries } = useMemo(() => {
		const computedAxis = getYAxis(summary.scores);
		const series = splitIntoSeries(points, computedAxis, plotBounds);
		const computedLineSeries = series.filter(
			(chartSeries) => chartSeries.length > GrowthChartConfig.SINGLE_POINT,
		);
		const isolatedPoints = series
			.filter(
				(chartSeries) => chartSeries.length === GrowthChartConfig.SINGLE_POINT,
			)
			.flat();
		const lastPoint = series.at(LAST_ELEMENT_INDEX)?.at(LAST_ELEMENT_INDEX);
		const isLastPointIsolated = isolatedPoints.some(
			(point) => point.date === lastPoint?.date,
		);
		const computedDots =
			lastPoint && !isLastPointIsolated
				? [...isolatedPoints, lastPoint]
				: isolatedPoints;

		return {
			axis: computedAxis,
			dots: computedDots,
			lineSeries: computedLineSeries,
		};
	}, [points, summary, plotBounds]);

	const viewBox = `0 0 ${String(dimensions.width)} ${String(dimensions.height)}`;

	return (
		<div className={styles["scroll"]}>
			<svg
				aria-label={getGrowthDescription(summary, points.length, granularity)}
				className={styles["chart"]}
				ref={elementReference}
				role="img"
				viewBox={viewBox}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
						<stop className={styles["stop-start"]} offset="0" />
						<stop className={styles["stop-end"]} offset="1" />
					</linearGradient>
				</defs>
				{axis.ticks.map((tick) => (
					<g key={tick}>
						<line
							className={styles["grid"]}
							x1={GrowthChartConfig.PADDING_LEFT}
							x2={plotBounds.plotRight}
							y1={getPlotY(tick, axis, plotBounds)}
							y2={getPlotY(tick, axis, plotBounds)}
						/>
						<text
							className={styles["axis-label-y"]}
							x={GrowthChartConfig.PADDING_LEFT - GrowthChartConfig.LABEL_GAP}
							y={getPlotY(tick, axis, plotBounds)}
						>
							{tick.toFixed(SCORE_FRACTION_DIGITS)}
						</text>
					</g>
				))}
				{lineSeries.map((chartSeries) => (
					<g key={chartSeries.at(FIRST_ELEMENT_INDEX)?.date}>
						<path
							className={styles["area"]}
							d={buildAreaPath(chartSeries, plotBounds.plotBottom)}
							fill={`url(#${gradientId})`}
						/>
						<path className={styles["line"]} d={buildLinePath(chartSeries)} />
					</g>
				))}
				{dots.map((dot) => (
					<circle
						className={styles["dot"]}
						cx={dot.x}
						cy={dot.y}
						key={dot.date}
						r={GrowthChartConfig.DOT_RADIUS}
					/>
				))}
				{points.map((point, index) => (
					<text
						className={styles["axis-label-x"]}
						key={point.date}
						x={getPlotX(index, points.length, plotBounds)}
						y={plotBounds.plotBottom + GrowthChartConfig.X_LABEL_OFFSET}
					>
						{getXAxisLabel(index, points.length, granularity)}
					</text>
				))}
			</svg>
		</div>
	);
};

export { GrowthChart };
