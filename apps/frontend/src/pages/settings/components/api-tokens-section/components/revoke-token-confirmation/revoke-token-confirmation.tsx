import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { ButtonVariant } from "~/libs/enums/enums.js";

import { ApiTokensMessage } from "../../libs/enums/enums.js";

type Properties = {
	confirmRevoke: () => void;
	handleRevokeCancel: () => void;
	isRevoking: boolean;
	pendingRevokeId: null | string;
};

const RevokeTokenConfirmation = ({
	confirmRevoke,
	handleRevokeCancel,
	isRevoking,
	pendingRevokeId,
}: Properties) => {
	return (
		<Confirmation
			confirmLabel={ApiTokensMessage.REVOKE}
			confirmVariant={ButtonVariant.PRIMARY}
			isLoading={isRevoking}
			isOpen={Boolean(pendingRevokeId)}
			onCancel={handleRevokeCancel}
			onConfirm={confirmRevoke}
			title={ApiTokensMessage.REVOKE_TITLE}
			tone="danger"
		>
			{ApiTokensMessage.REVOKE_CONFIRM}
		</Confirmation>
	);
};

export { RevokeTokenConfirmation };
