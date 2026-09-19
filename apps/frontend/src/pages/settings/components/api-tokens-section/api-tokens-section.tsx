import { useCallback, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Confirmation } from "~/libs/components/confirmation/confirmation.js";
import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";
import {
	useCreateApiTokenMutation,
	useGetApiTokensQuery,
	useRevokeApiTokenMutation,
} from "~/modules/api-tokens/api-tokens-api.js";
import {
	type ApiTokenRequestDto,
	type ApiTokenResponseDto,
	tokenCreateValidationSchema,
} from "~/modules/api-tokens/api-tokens.js";

import { ApiTokenRow } from "./components/api-token-row/api-token-row.js";
import { IssuedTokenDialog } from "./components/issued-token-dialog/issued-token-dialog.js";
import { ApiTokensMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const DEFAULT_VALUES: ApiTokenRequestDto = { name: "" };

const ApiTokensSection: React.FC = () => {
	const { data: tokens, isLoading } = useGetApiTokensQuery(undefined);
	const [createApiToken, { isLoading: isCreating }] =
		useCreateApiTokenMutation();
	const [revokeApiToken, { isLoading: isRevoking }] =
		useRevokeApiTokenMutation();

	const [issuedToken, setIssuedToken] = useState<ApiTokenResponseDto | null>(
		null,
	);
	const [pendingRevokeId, setPendingRevokeId] = useState<null | string>(null);

	const { control, handleSubmit, reset } = useAppForm<ApiTokenRequestDto>({
		defaultValues: DEFAULT_VALUES,
		validationSchema: tokenCreateValidationSchema,
	});

	const handleCreate = useCallback(
		(payload: ApiTokenRequestDto): void => {
			void createApiToken(payload)
				.unwrap()
				.then((created: ApiTokenResponseDto) => {
					setIssuedToken(created);
					reset(DEFAULT_VALUES);
				})
				.catch(() => {
					showNotification({
						message: ApiTokensMessage.CREATE_ERROR,
						type: "danger",
					});
				});
		},
		[createApiToken, reset],
	);

	const handleCreateSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(handleCreate)(event);
		},
		[handleCreate, handleSubmit],
	);

	const handleIssuedDialogClose = useCallback((): void => {
		setIssuedToken(null);
	}, []);

	const handleRevokeRequest = useCallback((id: string): void => {
		setPendingRevokeId(id);
	}, []);

	const handleRevokeCancel = useCallback((): void => {
		setPendingRevokeId(null);
	}, []);

	const handleRevokeConfirm = useCallback((): void => {
		if (!pendingRevokeId) {
			return;
		}

		void revokeApiToken(pendingRevokeId)
			.unwrap()
			.then(() => {
				showNotification({
					message: ApiTokensMessage.REVOKED,
					type: "success",
				});
			})
			.catch(() => {
				showNotification({
					message: ApiTokensMessage.REVOKE_ERROR,
					type: "danger",
				});
			})
			.finally(() => {
				setPendingRevokeId(null);
			});
	}, [pendingRevokeId, revokeApiToken]);

	const hasTokens = Boolean(tokens && tokens.length > EMPTY_LENGTH);

	return (
		<section className={styles["section"]}>
			<p className={styles["description"]}>
				{ApiTokensMessage.SECTION_DESCRIPTION}
			</p>

			<form className={styles["form"]} onSubmit={handleCreateSubmit}>
				<div className={styles["form-field"]}>
					<Input
						control={control}
						label={ApiTokensMessage.NAME_LABEL}
						name="name"
						placeholder={ApiTokensMessage.NAME_PLACEHOLDER}
					/>
				</div>
				<Button
					isDisabled={isCreating}
					label={ApiTokensMessage.CREATE}
					size={ControlSize.MD}
					type="submit"
					variant={ButtonVariant.PRIMARY}
				/>
			</form>

			{isLoading && (
				<Loader
					label={ApiTokensMessage.LOADING}
					variant={LoaderVariant.SECTION}
				/>
			)}

			{!isLoading && !hasTokens && (
				<p className={styles["empty"]}>{ApiTokensMessage.EMPTY}</p>
			)}

			{hasTokens && (
				<ul className={styles["list"]}>
					{tokens?.map((token) => (
						<ApiTokenRow
							key={token.id}
							onRevoke={handleRevokeRequest}
							token={token}
						/>
					))}
				</ul>
			)}

			<IssuedTokenDialog
				key={issuedToken?.id}
				onClose={handleIssuedDialogClose}
				token={issuedToken}
			/>

			<Confirmation
				confirmLabel={ApiTokensMessage.REVOKE}
				confirmVariant={ButtonVariant.PRIMARY}
				isLoading={isRevoking}
				isOpen={Boolean(pendingRevokeId)}
				onCancel={handleRevokeCancel}
				onConfirm={handleRevokeConfirm}
				title={ApiTokensMessage.REVOKE_TITLE}
				tone="danger"
			>
				{ApiTokensMessage.REVOKE_CONFIRM}
			</Confirmation>
		</section>
	);
};

export { ApiTokensSection };
