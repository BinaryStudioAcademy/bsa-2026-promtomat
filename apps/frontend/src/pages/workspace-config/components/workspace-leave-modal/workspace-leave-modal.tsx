import { useCallback } from "react";

import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import { useDeleteWorkspaceContributorMutation } from "~/modules/workspaces/workspaces.js";

import { WorkspaceLeaveMessage } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	currentUserId: number;
	onClose: () => void;
	onLeft: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceLeaveModal: React.FC<Properties> = ({
	currentUserId,
	onClose,
	onLeft,
	workspace,
}: Properties) => {
	const [leaveWorkspace, { isLoading }] =
		useDeleteWorkspaceContributorMutation();

	const question = `Are you sure you want to leave “${workspace.name}”?`;
	const confirmLabel = isLoading
		? WorkspaceLeaveMessage.LEAVING
		: WorkspaceLeaveMessage.LEAVE;

	const handleLeaveConfirm = useCallback((): void => {
		void leaveWorkspace({
			userId: currentUserId,
			workspaceId: workspace.id,
		}).then(({ data }) => {
			if (data !== undefined) {
				onLeft();
			}
		});
	}, [currentUserId, leaveWorkspace, onLeft, workspace.id]);

	return (
		<Confirmation
			confirmLabel={confirmLabel}
			confirmVariant={ButtonVariant.DANGER}
			isDisabled={isLoading}
			isLoading={isLoading}
			isOpen
			onCancel={onClose}
			onConfirm={handleLeaveConfirm}
			title={WorkspaceLeaveMessage.TITLE}
			titleIconName={IconName.ALERT_CIRCLE}
			tone="danger"
		>
			<div className={styles["content"]}>
				<p className={styles["text"]}>{question}</p>
				<p className={styles["text"]}>
					{WorkspaceLeaveMessage.ACCESS_WILL_BE_LOST}
				</p>
			</div>
		</Confirmation>
	);
};

export { WorkspaceLeaveModal };
