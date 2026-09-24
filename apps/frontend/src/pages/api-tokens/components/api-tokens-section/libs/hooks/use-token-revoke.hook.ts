import { useCallback, useState } from "react";

import { useRevokeApiTokenMutation } from "~/modules/api-tokens/api-tokens-api.js";

import { ApiTokensNotification } from "../enums/enums.js";
import { invokeActionWithToasts } from "../helpers/helpers.js";

const useTokenRevoke = () => {
	const [revokeApiToken, { isLoading }] = useRevokeApiTokenMutation();

	const [pendingRevokeId, setPendingRevokeId] = useState<null | string>(null);

	const handleTokenRevoked = useCallback(() => {
		setPendingRevokeId(null);
	}, []);

	const handleRevokeRequest = useCallback((id: string): void => {
		setPendingRevokeId(id);
	}, []);

	const handleRevokeCancel = useCallback((): void => {
		setPendingRevokeId(null);
	}, []);

	const handleConfirmRevoke = useCallback((): void => {
		if (!pendingRevokeId) {
			return;
		}

		void invokeActionWithToasts({
			action: revokeApiToken(pendingRevokeId).unwrap(),
			errorMessage: ApiTokensNotification.REVOKE_FAILED,
			finalize: handleTokenRevoked,
			successMessage: ApiTokensNotification.REVOKE_SUCCEEDED,
		});
	}, [pendingRevokeId, revokeApiToken]);

	return {
		handleConfirmRevoke,
		handleRevokeCancel,
		handleRevokeRequest,
		isRevoking: isLoading,
		pendingRevokeId,
	};
};

export { useTokenRevoke };
