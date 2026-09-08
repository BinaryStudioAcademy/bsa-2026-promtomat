import { useCallback } from "react";

import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import {
	ButtonVariant,
	ErrorCode,
	HTTPCode,
	IconName,
} from "~/libs/enums/enums.js";
import { getErrorMessage } from "~/libs/modules/api/libs/helpers/get-error-message.helper.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { WorkspacesErrorCode } from "~/modules/workspaces/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import { useDeleteWorkspaceMutation } from "~/modules/workspaces/workspaces.js";
import { FormAlert } from "~/pages/auth/components/form-alert/form-alert.js";

import {
	WorkspaceDeleteMessage,
	WorkspaceFormMessage,
} from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceDeleteModal: React.FC<Properties> = ({
	onClose,
	workspace,
}: Properties) => {
	const [deleteWorkspace, { error, isLoading }] = useDeleteWorkspaceMutation();

	const errorMessage = getErrorMessage(error);

	const hasLastWorkspaceDeletionError =
		isServerError(error) &&
		error.status === HTTPCode.CONFLICT &&
		error.code === WorkspacesErrorCode.LAST_WORKSPACE_DELETION_NOT_ALLOWED;

	const isToastedError =
		isServerError(error) && error.code === ErrorCode.INTERNAL_SERVER_ERROR;

	const hasError = Boolean(error);
	const hasGeneralError =
		hasError && !hasLastWorkspaceDeletionError && !isToastedError;

	const handleDeleteConfirm = useCallback((): void => {
		void deleteWorkspace(workspace.id).then(({ data }) => {
			if (data !== undefined) {
				onClose();
			}
		});
	}, [deleteWorkspace, onClose, workspace.id]);

	const deleteConfirmHandler = hasLastWorkspaceDeletionError
		? undefined
		: handleDeleteConfirm;

	return (
		<Confirmation
			confirmLabel={
				isLoading ? WorkspaceFormMessage.DELETING : WorkspaceFormMessage.DELETE
			}
			confirmVariant={ButtonVariant.DANGER}
			isDisabled={isLoading}
			isOpen
			onCancel={onClose}
			onConfirm={deleteConfirmHandler}
			title={`Delete "${workspace.name}" permanently`}
			titleIconName={IconName.ALERT_CIRCLE}
			tone="danger"
		>
			<div className={styles["content"]}>
				{hasLastWorkspaceDeletionError ? (
					<p className={styles["text"]}>{errorMessage}</p>
				) : (
					<>
						{hasGeneralError && (
							<FormAlert message={WorkspaceDeleteMessage.FAILURE} />
						)}
						<div className={styles["consequence"]}>
							<p className={styles["text"]}>
								<strong className={styles["impact"]}>
									{workspace.promptCount} prompts
								</strong>{" "}
								will be destroyed.
							</p>
							<p className={styles["text"]}>This cannot be undone.</p>
						</div>
					</>
				)}
			</div>
		</Confirmation>
	);
};

export { WorkspaceDeleteModal };
