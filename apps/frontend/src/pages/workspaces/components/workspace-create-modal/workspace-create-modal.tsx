import { Modal } from "~/libs/components/modal/modal.js";

import { WorkspaceCreateForm } from "../workspace-create-form/workspace-create-form.js";

type Properties = {
	isOpen: boolean;
	onClose: () => void;
};

const WorkspaceCreateModal: React.FC<Properties> = ({
	isOpen,
	onClose,
}: Properties) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Create workspace">
			<WorkspaceCreateForm onClose={onClose} />
		</Modal>
	);
};

export { WorkspaceCreateModal };
