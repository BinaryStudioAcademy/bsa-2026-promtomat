import { Button } from "~/libs/components/button/button.js";
import { Modal } from "~/libs/components/modal/modal.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceContributorsModal: React.FC<Properties> = ({
	onClose,
	workspace,
}: Properties) => {
	const title = `Manage Access: ${workspace.name}`;
	return (
		<Modal
			footer={
				<Button
					label="Close"
					onClick={onClose}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			}
			isOpen
			onClose={onClose}
			subtitle="Owned by you"
			title={title}
		>
			<div className={styles["body"]}>
				<h3 className={styles["section-label"]}>Find a user</h3>

				<hr className={styles["divider"]} />

				<div className={styles["section-header"]}>
					<h3 className={styles["section-label"]}>Current contributors</h3>
					<span className={styles["count-badge"]}>–</span>
				</div>
			</div>
		</Modal>
	);
};

export { WorkspaceContributorsModal };
