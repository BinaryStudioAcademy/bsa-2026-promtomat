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

	const handleRevokeCancel = useCallback((): void => {
		setPendingRevokeId(null);
	}, []);

	const confirmRevoke = useCallback((): void => {
		if (!pendingRevokeId) {
			return;
		}

		void invokeActionWithToasts(
			revokeApiToken(pendingRevokeId).unwrap(),
			ApiTokensNotification.REVOKE_SUCCEEDED,
			ApiTokensNotification.REVOKE_FAILED,
			onTokenRevoked,
		);
	}, [pendingRevokeId, revokeApiToken]);

	return {
		confirmRevoke,
		handleRevokeCancel,
		handleRevokeRequest,
		isRevoking: isLoading,
		pendingRevokeId,
	};
};

export { useTokenRevoke };
