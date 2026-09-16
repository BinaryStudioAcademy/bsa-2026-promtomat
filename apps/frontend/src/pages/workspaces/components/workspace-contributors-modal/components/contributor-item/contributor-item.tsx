import { useCallback } from "react";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type WorkspaceUserSummaryDto } from "~/modules/workspaces/libs/types/types.js";

import { UserItem } from "../user-item/user-item.js";
import styles from "./styles.module.css";

type Properties = {
	isDisabled: boolean;
	onRemove: (userId: number) => void;
	user: WorkspaceUserSummaryDto;
};

const ContributorItem: React.FC<Properties> = ({
	isDisabled,
	onRemove,
	user,
}: Properties) => {
	const contributorRemoveLabel = `Remove ${user.nickname}`;

	const handleRemove = useCallback((): void => {
		onRemove(user.id);
	}, [onRemove, user.id]);

	return (
		<UserItem
			action={
				<IconButton
					ariaLabel={contributorRemoveLabel}
					className={styles["remove-button"]}
					iconName={IconName.TRASH_2}
					isDisabled={isDisabled}
					onClick={handleRemove}
					size={ControlSize.MD}
				/>
			}
			user={user}
		/>
	);
};

export { ContributorItem };
