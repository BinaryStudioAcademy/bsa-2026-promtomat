import { useCallback } from "react";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type WorkspaceUserSummaryDto } from "~/modules/workspaces/libs/types/types.js";

import { UserItem } from "../user-item/user-item.js";
import styles from "./styles.module.css";

type Properties = {
	isDisabled: boolean;
	onAdd: (userId: number) => void;
	user: WorkspaceUserSummaryDto;
};

const CandidateItem: React.FC<Properties> = ({
	isDisabled,
	onAdd,
	user,
}: Properties) => {
	const candidateAddLabel = `Add ${user.nickname}`;

	const handleAdd = useCallback((): void => {
		onAdd(user.id);
	}, [onAdd, user.id]);

	return (
		<UserItem
			action={
				<IconButton
					ariaLabel={candidateAddLabel}
					className={styles["add-button"]}
					iconName={IconName.PLUS}
					isDisabled={isDisabled}
					onClick={handleAdd}
					size={ControlSize.MD}
				/>
			}
			user={user}
		/>
	);
};

export { CandidateItem };
