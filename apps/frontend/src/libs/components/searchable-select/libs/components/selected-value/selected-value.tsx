import { Icon } from "~/libs/components/icon/icon.js";
import { IconName } from "~/libs/enums/enums.js";

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
	return (
		<li className={styles["value"]}>
			<span className={styles["value-text"]}>{value}</span>
			<button
				aria-label={`Remove ${value}`}
				className={styles["remove"]}
				disabled={isDisabled}
				onClick={onRemove(value)}
				type="button"
			>
				<Icon className={styles["remove-icon"]} iconName={IconName.CLOSE} />
			</button>
		</li>
	);
};

export { SelectedValue };
