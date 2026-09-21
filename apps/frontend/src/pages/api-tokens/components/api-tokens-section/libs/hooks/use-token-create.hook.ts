import { useCallback, useState } from "react";

import { useCreateApiTokenMutation } from "~/modules/api-tokens/api-tokens-api.js";
import {
	ApiTokenRequestDto,
	ApiTokenResponseDto,
} from "~/modules/api-tokens/api-tokens.js";

import { ApiTokensNotification } from "../enums/enums.js";
import { invokeAction } from "../helpers/helpers.js";

const useTokenCreate = (onCreated: () => void) => {
	const [createApiToken, { isLoading }] = useCreateApiTokenMutation();
	const [issuedToken, setIssuedToken] = useState<ApiTokenResponseDto | null>(
		null,
	);

	const onTokenCreated = useCallback(
		(created: ApiTokenResponseDto) => {
			setIssuedToken(created);
			onCreated();
		},
		[createApiToken, onCreated],
	);

	const resetIssuedToken = useCallback(() => {
		setIssuedToken(null);
	}, []);

	const handleCreate = useCallback(
		(payload: ApiTokenRequestDto): void => {
			void invokeAction(
				createApiToken(payload).unwrap(),
				onTokenCreated,
				ApiTokensNotification.CREATE_FAILED,
			);
		},
		[createApiToken],
	);

	return {
		handleCreate,
		isCreating: isLoading,
		issuedToken,
		resetIssuedToken,
	};
};

export { useTokenCreate };
