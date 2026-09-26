import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type SelectedValueProperties = {
	isDisabled: boolean;
	onRemove: (value: string) => () => void;
	value: string;
};

const SelectedValue = ({
	isDisabled,
	onRemove,
	value,
}: SelectedValueProperties): React.JSX.Element => {
	const valueClassName = getValidClasses(
		styles["value"],
		isDisabled && styles["value-disabled"],
	);

	return (
		<li className={valueClassName}>
			<span className={styles["value-text"]}>{value}</span>
			<IconButton
				ariaLabel={`Remove ${value}`}
				className={getValidClasses(styles["remove"])}
				iconName={IconName.CLOSE}
				isDisabled={isDisabled}
				onClick={onRemove(value)}
			/>
		</li>
	);
};

export { SelectedValue };
