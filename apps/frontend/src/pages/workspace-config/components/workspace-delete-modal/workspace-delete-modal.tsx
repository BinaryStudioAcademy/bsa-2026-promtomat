import { useCallback } from "react";

import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ModalTone } from "~/libs/components/modal/libs/enums/enums.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import { useDeleteWorkspaceMutation } from "~/modules/workspaces/workspaces.js";

import { WorkspaceDeleteMessage } from "../../libs/enums/enums.js";
import {
	EMPTY_PROMPT_COUNT,
	SINGLE_PROMPT_COUNT,
} from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
	onSuccess: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceDeleteModal: React.FC<Properties> = ({
	onClose,
	onSuccess,
	workspace,
}: Properties) => {
	const [deleteWorkspace, { isLoading }] = useDeleteWorkspaceMutation();
	const hasPrompts = workspace.promptCount > EMPTY_PROMPT_COUNT;

	const promptCountLabel =
		workspace.promptCount === SINGLE_PROMPT_COUNT ? "prompt" : "prompts";

	const modalTitle = configureString(WorkspaceDeleteMessage.TITLE, {
		workspaceName: workspace.name,
	});

	const handleDeleteConfirm = useCallback((): void => {
		void deleteWorkspace(workspace.id).then(({ error }) => {
			const hasError = Boolean(error);

			if (!hasError) {
				onSuccess();
			}
		});
	}, [deleteWorkspace, onSuccess, workspace.id]);

	return (
		<Confirmation
			confirmLabel={WorkspaceDeleteMessage.DELETE}
			confirmVariant={ButtonVariant.DANGER}
			isDisabled={isLoading}
			isLoading={isLoading}
			isOpen
			onCancel={onClose}
			onConfirm={handleDeleteConfirm}
			title={modalTitle}
			titleIconName={IconName.ALERT_CIRCLE}
			tone={ModalTone.DANGER}
		>
			<div className={styles["consequence"]}>
				<p className={styles["text"]}>
					{hasPrompts ? (
						<>
							<strong className={styles["impact"]}>
								{workspace.promptCount} {promptCountLabel}
							</strong>{" "}
							will be destroyed.
						</>
					) : (
						WorkspaceDeleteMessage.NO_PROMPTS
					)}
				</p>
				<p className={styles["text"]}>
					{WorkspaceDeleteMessage.DELETION_CANNOT_BE_UNDONE}
				</p>
			</div>
		</Confirmation>
	);
};

export { WorkspaceDeleteModal };
