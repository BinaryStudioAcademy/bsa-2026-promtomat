import { Fragment, useCallback, useId } from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { type SegmentedControlOption } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties<T extends string> = {
	className?: string | undefined;
	label: string;
	onChange: (value: T) => void;
	options: readonly SegmentedControlOption<T>[];
	value: T;
	variant?: "default" | "raised";
};

const SegmentedControl = <T extends string>({
	className,
	label,
	onChange,
	options,
	value,
	variant = "default",
}: Properties<T>): React.JSX.Element => {
	const groupName = useId();

	const handleChange = useCallback(
		(optionValue: T) => {
			return (): void => {
				onChange(optionValue);
			};
		},
		[onChange],
	);

	return (
		<fieldset
			className={getValidClasses(
				styles["group"],
				variant === "raised" && styles["raised"],
				className,
			)}
		>
			<legend className="visually-hidden">{label}</legend>

			{options.map((option) => {
				const optionId = `${groupName}-${option.value}`;

				return (
					<Fragment key={option.value}>
						<input
							checked={value === option.value}
							className={getValidClasses(styles["input"], "visually-hidden")}
							id={optionId}
							name={groupName}
							onChange={handleChange(option.value)}
							type="radio"
							value={option.value}
						/>
						<label
							className={styles["label"]}
							data-label={option.label}
							htmlFor={optionId}
						>
							{option.label}
						</label>
					</Fragment>
				);
			})}
		</fieldset>
	);
};

export { SegmentedControl };
