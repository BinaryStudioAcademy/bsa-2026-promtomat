import { useCallback, useState } from "react";

import { useRevokeApiTokenMutation } from "~/modules/api-tokens/api-tokens-api.js";

import { ApiTokensNotification } from "../enums/enums.js";
import { invokeActionWithToasts } from "../helpers/helpers.js";

const useTokenRevoke = () => {
	const [revokeApiToken, { isLoading }] = useRevokeApiTokenMutation();

	const [pendingRevokeId, setPendingRevokeId] = useState<null | string>(null);

	const onTokenRevoked = useCallback(() => {
		setPendingRevokeId(null);
	}, []);

	const handleRevokeRequest = useCallback((id: string): void => {
		setPendingRevokeId(id);
	}, []);

	const onRevokeCancel = useCallback((): void => {
		setPendingRevokeId(null);
	}, []);

	const onConfirmRevoke = useCallback((): void => {
		if (!pendingRevokeId) {
			return;
		}

		void invokeActionWithToasts({
			action: revokeApiToken(pendingRevokeId).unwrap(),
			errorMessage: ApiTokensNotification.REVOKE_FAILED,
			finalize: onTokenRevoked,
			successMessage: ApiTokensNotification.REVOKE_SUCCEEDED,
		});
	}, [pendingRevokeId, revokeApiToken]);

	return {
		handleRevokeRequest,
		isRevoking: isLoading,
		onConfirmRevoke,
		onRevokeCancel,
		pendingRevokeId,
	};
};

export { useTokenRevoke };
