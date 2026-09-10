import { useCallback } from "react";

import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ButtonVariant, IconName } from "~/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import { useDeleteWorkspaceMutation } from "~/modules/workspaces/workspaces.js";

import {
	WorkspaceDeleteMessage,
	WorkspaceFormMessage,
} from "../../libs/enums/enums.js";
import {
	EMPTY_PROMPT_COUNT,
	SINGLE_PROMPT_COUNT,
} from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceDeleteModal: React.FC<Properties> = ({
	onClose,
	workspace,
}: Properties) => {
	const [deleteWorkspace, { isLoading }] = useDeleteWorkspaceMutation();
	const hasNoPrompts = workspace.promptCount === EMPTY_PROMPT_COUNT;

	const promptCountLabel =
		workspace.promptCount === SINGLE_PROMPT_COUNT ? "prompt" : "prompts";

	const handleDeleteConfirm = useCallback((): void => {
		void deleteWorkspace(workspace.id).then(({ data }) => {
			if (data !== undefined) {
				onClose();
			}
		});
	}, [deleteWorkspace, onClose, workspace.id]);

	return (
		<Confirmation
			confirmLabel={
				isLoading ? WorkspaceFormMessage.DELETING : WorkspaceFormMessage.DELETE
			}
			confirmVariant={ButtonVariant.DANGER}
			isDisabled={isLoading}
			isLoading={isLoading}
			isOpen
			onCancel={onClose}
			onConfirm={handleDeleteConfirm}
			title={`Delete "${workspace.name}" permanently`}
			titleIconName={IconName.ALERT_CIRCLE}
			tone="danger"
		>
			<div className={styles["content"]}>
				<div className={styles["consequence"]}>
					<p className={styles["text"]}>
						{hasNoPrompts ? (
							WorkspaceDeleteMessage.NO_PROMPTS
						) : (
							<>
								<strong className={styles["impact"]}>
									{workspace.promptCount} {promptCountLabel}
								</strong>{" "}
								will be destroyed.
							</>
						)}
					</p>
					<p className={styles["text"]}>
						{WorkspaceDeleteMessage.DELETION_CANNOT_BE_UNDONE}
					</p>
				</div>
			</div>
		</Confirmation>
	);
};

export { WorkspaceDeleteModal };
