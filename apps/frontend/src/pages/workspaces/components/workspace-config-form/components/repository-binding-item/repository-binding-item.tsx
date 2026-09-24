import { useCallback } from "react";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type RepositoryBindingDto } from "~/modules/repository-bindings/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	binding: RepositoryBindingDto;
	isDisabled: boolean;
	onRemove: (repositoryBindingId: number) => void;
};

const RepositoryBindingItem: React.FC<Properties> = ({
	binding,
	isDisabled,
	onRemove,
}: Properties) => {
	const identity = `${binding.owner}/${binding.repo}`;
	const bindingRemoveLabel = `Remove ${identity}`;

	const handleRemove = useCallback((): void => {
		onRemove(binding.id);
	}, [binding.id, onRemove]);

	return (
		<li className={styles["item"]}>
			<div className={styles["identity"]}>
				<span className={styles["name"]} title={identity}>
					{identity}
				</span>
				<span className={styles["host"]}>{binding.host}</span>
			</div>
			<IconButton
				ariaLabel={bindingRemoveLabel}
				className={styles["remove-button"]}
				iconName={IconName.TRASH_2}
				isDisabled={isDisabled}
				onClick={handleRemove}
				size={ControlSize.MD}
			/>
		</li>
	);
};

export { RepositoryBindingItem };
