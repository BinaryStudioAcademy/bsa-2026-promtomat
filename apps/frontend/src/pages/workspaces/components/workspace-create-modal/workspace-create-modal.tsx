import { Modal } from "~/libs/components/modal/modal.js";

import { WorkspaceCreateForm } from "../workspace-create-form/workspace-create-form.js";

type Properties = {
	onClose: () => void;
};

const WorkspaceCreateModal: React.FC<Properties> = ({
	onClose,
}: Properties) => {
	return (
		<Modal isOpen onClose={onClose} title="Create workspace">
			<WorkspaceCreateForm onClose={onClose} />
		</Modal>
	);
};

export { WorkspaceCreateModal };
