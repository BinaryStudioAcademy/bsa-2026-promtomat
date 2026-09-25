import { useCallback } from "react";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type WorkspaceUserSummaryDto } from "~/modules/workspaces/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	isDisabled?: boolean;
	isOwner: boolean;
	onRemove: (userId: number) => void;
	user: WorkspaceUserSummaryDto;
};

const ContributorItem: React.FC<Properties> = ({
	isDisabled = false,
	isOwner,
	onRemove,
	user,
}: Properties) => {
	const contributorRemoveLabel = `Remove ${user.nickname}`;

	const handleRemove = useCallback((): void => {
		onRemove(user.id);
	}, [onRemove, user.id]);

	return (
		<li className={styles["item"]}>
			<div className={styles["identity"]}>
				<span className={styles["name"]}>{user.nickname}</span>
				<span className={styles["email"]}>{user.email}</span>
			</div>
			{isOwner && (
				<IconButton
					ariaLabel={contributorRemoveLabel}
					className={styles["remove-button"]}
					iconName={IconName.TRASH_2}
					isDisabled={isDisabled}
					onClick={handleRemove}
					size={ControlSize.MD}
				/>
			)}
		</li>
	);
};

export { ContributorItem };
