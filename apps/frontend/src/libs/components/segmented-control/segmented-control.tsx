import { Fragment, useCallback, useId } from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";

import { type SegmentedControlOption } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties<T extends string> = {
	label: string;
	onChange: (value: T) => void;
	options: readonly SegmentedControlOption<T>[];
	value: T;
};

const SegmentedControl = <T extends string>({
	label,
	onChange,
	options,
	value,
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
		<fieldset className={styles["group"]}>
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
