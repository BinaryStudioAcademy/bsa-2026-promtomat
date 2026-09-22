import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { type ApiTokenDto } from "~/modules/api-tokens/api-tokens.js";

import {
	ApiTokensMessage,
	ApiTokenStatusClass,
	ApiTokenStatusLabel,
} from "../../libs/enums/enums.js";
import {
	formatExpirationDate,
	formatTokenIdPrefix,
	getTokenStatus,
} from "../../libs/helpers/helpers.js";
import styles from "../../styles.module.css";

type Properties = {
	onRevoke: (id: string) => void;
	token: ApiTokenDto;
};

const ApiTokenRow: React.FC<Properties> = ({ onRevoke, token }: Properties) => {
	const handleRevoke = useCallback((): void => {
		onRevoke(token.id);
	}, [onRevoke, token.id]);

	const status = getTokenStatus(token.expiresAt);
	const { expiresAt } = token;

	return (
		<tr className={styles["row"]}>
			<td className={getValidClasses(styles["cell"], styles["cell-name"])}>
				<span className={styles["row-name"]}>{token.name}</span>
				<span className={styles["row-id"]}>
					{formatTokenIdPrefix(token.id)}
				</span>
			</td>
			<td className={getValidClasses(styles["cell"], styles["cell-last-used"])}>
				<span className={styles["row-meta"]}>
					{token.lastUsedAt
						? getRelativeTimeLabel(token.lastUsedAt)
						: ApiTokensMessage.LAST_USED_NEVER}
				</span>
			</td>
			<td className={getValidClasses(styles["cell"], styles["cell-expires"])}>
				{expiresAt === null ? (
					<span className={styles["row-expires"]}>
						{ApiTokensMessage.EXPIRES_NEVER}
					</span>
				) : (
					<>
						<span className={styles["row-expires"]}>
							{formatExpirationDate(expiresAt)}
						</span>
						<span className={styles["row-meta"]}>
							{getRelativeTimeLabel(expiresAt)}
						</span>
					</>
				)}
			</td>
			<td className={getValidClasses(styles["cell"], styles["cell-status"])}>
				<span
					className={getValidClasses(
						styles["pill"],
						styles[ApiTokenStatusClass[status]],
					)}
				>
					{ApiTokenStatusLabel[status]}
				</span>
			</td>
			<td className={getValidClasses(styles["cell"], styles["cell-action"])}>
				<Button
					label={ApiTokensMessage.REVOKE}
					onClick={handleRevoke}
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			</td>
		</tr>
	);
};

export { ApiTokenRow };
