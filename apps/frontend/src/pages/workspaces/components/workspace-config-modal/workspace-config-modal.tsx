import { Modal } from "~/libs/components/modal/modal.js";
import { type WorkspaceDto } from "~/modules/workspaces/libs/types/types.js";

import { WorkspaceConfigForm } from "../workspace-config-form/workspace-config-form.js";

type Properties = {
	onClose: () => void;
	workspace: WorkspaceDto;
};

const WorkspaceConfigModal: React.FC<Properties> = ({
	onClose,
	workspace,
}: Properties) => {
	return (
		<Modal isOpen onClose={onClose} title="Edit workspace">
			<WorkspaceConfigForm onClose={onClose} workspace={workspace} />
		</Modal>
	);
};

export { WorkspaceConfigModal };
