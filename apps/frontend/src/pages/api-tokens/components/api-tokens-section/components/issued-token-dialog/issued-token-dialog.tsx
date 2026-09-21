import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Modal } from "~/libs/components/modal/modal.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useClipboard } from "~/libs/hooks/use-clipboard/use-clipboard.hook.js";
import { type ApiTokenResponseDto } from "~/modules/api-tokens/api-tokens.js";

import { ApiTokensMessage } from "../../libs/enums/enums.js";
import {
	showTokenCopiedNotification,
	showTokenNotCopiedNotification,
} from "../../libs/helpers/helpers.js";
import styles from "../../styles.module.css";

type Properties = {
	onClose: () => void;
	token: ApiTokenResponseDto | null;
};

const IssuedTokenDialog: React.FC<Properties> = ({
	onClose,
	token,
}: Properties) => {
	const { copyToClipboard } = useClipboard();

	const onTokenCopied = useCallback(
		(isCopySuccessful: boolean) => {
			showTokenCopiedNotification(isCopySuccessful);

			if (isCopySuccessful) {
				onClose();
			}
		},
		[onClose],
	);

	const handleCopy = useCallback((): void => {
		if (!token) {
			return;
		}

		void copyToClipboard(token.value).then(onTokenCopied);
	}, [copyToClipboard, token, onTokenCopied]);

	const handleClose = useCallback((): void => {
		showTokenNotCopiedNotification();
		onClose();
	}, [onClose]);

	return (
		<Modal
			footer={
				<Button
					label={ApiTokensMessage.DIALOG_CLOSE_UNCOPIED}
					onClick={handleClose}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			}
			isOpen={Boolean(token)}
			onClose={handleClose}
			title={ApiTokensMessage.CREATED_TITLE}
		>
			<div className={styles["modal-body"]}>
				<p className={styles["warning"]}>{ApiTokensMessage.ONE_TIME_WARNING}</p>
				<div className={styles["value-box"]}>
					<code className={styles["value"]}>{token?.value}</code>
					<Button
						label={ApiTokensMessage.COPY}
						onClick={handleCopy}
						size={ControlSize.SM}
						type="button"
						variant={ButtonVariant.PRIMARY}
					/>
				</div>
				<p className={styles["hint"]}>{ApiTokensMessage.CONNECT_HINT}</p>
			</div>
		</Modal>
	);
};

export { IssuedTokenDialog };
