import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { type ApiTokenDto } from "~/modules/api-tokens/api-tokens.js";

import { ApiTokensMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	onRevoke: (id: string) => void;
	token: ApiTokenDto;
};

const ApiTokenRow: React.FC<Properties> = ({ onRevoke, token }: Properties) => {
	const handleRevoke = useCallback((): void => {
		onRevoke(token.id);
	}, [onRevoke, token.id]);

	const lastUsedLabel = token.lastUsedAt
		? new Date(token.lastUsedAt).toLocaleDateString()
		: ApiTokensMessage.LAST_USED_NEVER;

	return (
		<li className={styles["row"]}>
			<div className={styles["row-text"]}>
				<span className={styles["row-name"]}>{token.name}</span>
				<span className={styles["row-meta"]}>{lastUsedLabel}</span>
			</div>
			<Button
				label={ApiTokensMessage.REVOKE}
				onClick={handleRevoke}
				size={ControlSize.SM}
				type="button"
				variant={ButtonVariant.SECONDARY}
			/>
		</li>
	);
};

export { ApiTokenRow };
