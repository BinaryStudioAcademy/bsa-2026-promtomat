import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ButtonVariant } from "~/libs/enums/enums.js";

import { ApiTokensMessage } from "../../libs/enums/enums.js";

type Properties = {
	isRevoking: boolean;
	onConfirmRevoke: () => void;
	onRevokeCancel: () => void;
	pendingRevokeId: null | string;
};

const RevokeTokenConfirmation: React.FC<Properties> = ({
	isRevoking,
	onConfirmRevoke,
	onRevokeCancel,
	pendingRevokeId,
}: Properties) => {
	return (
		<Confirmation
			confirmLabel={ApiTokensMessage.REVOKE}
			confirmVariant={ButtonVariant.PRIMARY}
			isLoading={isRevoking}
			isOpen={Boolean(pendingRevokeId)}
			onCancel={onRevokeCancel}
			onConfirm={onConfirmRevoke}
			title={ApiTokensMessage.REVOKE_TITLE}
			tone="danger"
		>
			{ApiTokensMessage.REVOKE_CONFIRM}
		</Confirmation>
	);
};

export { RevokeTokenConfirmation };
