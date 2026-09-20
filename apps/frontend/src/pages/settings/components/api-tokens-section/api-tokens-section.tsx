import { useGetApiTokensQuery } from "~/modules/api-tokens/api-tokens-api.js";

import { ApiTokensList } from "./components/api-tokens-list/api-tokens-list.js";
import { CreateTokenForm } from "./components/create-token-form/create-token-form.js";
import { EmptyMessage } from "./components/empty-message/empty-message.js";
import { IssuedTokenDialog } from "./components/issued-token-dialog/issued-token-dialog.js";
import { LoadingIndicator } from "./components/loading-indicator/loading-indicator.js";
import { RevokeTokenConfirmation } from "./components/revoke-token-confirmation/revoke-token-confirmation.js";
import { SectionDescription } from "./components/section-description/section-description.js";
import { EMPTY_TOKEN_LEN } from "./libs/constants/constants.js";
import {
	useCreateTokenForm,
	useTokenCreate,
	useTokenRevoke,
} from "./libs/hooks/hooks.js";
import styles from "./styles.module.css";

const ApiTokensSection: React.FC = () => {
	const { data: tokens, isLoading } = useGetApiTokensQuery(undefined);

	const {
		confirmRevoke,
		handleRevokeCancel,
		handleRevokeRequest,
		isRevoking,
		pendingRevokeId,
	} = useTokenRevoke();

	const { control, handleCreateSubmit, resetValuesToDefault } =
		useCreateTokenForm();

	const { handleCreate, isCreating, issuedToken, resetIssuedToken } =
		useTokenCreate(resetValuesToDefault);

	return (
		<section className={styles["section"]}>
			<SectionDescription />

			<CreateTokenForm
				control={control}
				isCreating={isCreating}
				onSubmit={handleCreateSubmit(handleCreate)}
			/>

			<LoadingIndicator isLoading={isLoading} />

			<EmptyMessage
				hasTokens={Boolean(tokens && tokens.length > EMPTY_TOKEN_LEN)}
				isLoading={isLoading}
			/>

			<ApiTokensList handleRevoke={handleRevokeRequest} tokens={tokens} />

			<IssuedTokenDialog
				key={issuedToken?.id}
				onClose={resetIssuedToken}
				token={issuedToken}
			/>

			<RevokeTokenConfirmation
				confirmRevoke={confirmRevoke}
				handleRevokeCancel={handleRevokeCancel}
				isRevoking={isRevoking}
				pendingRevokeId={pendingRevokeId}
			/>
		</section>
	);
};

export { ApiTokensSection };
