import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import {
	getRelativeTimeLabel,
	getValidClasses,
} from "~/libs/helpers/helpers.js";
import { type ApiTokenDto } from "~/modules/api-tokens/api-tokens.js";

import { ApiTokensMessage, ApiTokenStatus } from "../../libs/enums/enums.js";
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

const STATUS_LABEL = {
	[ApiTokenStatus.ACTIVE]: ApiTokensMessage.STATUS_ACTIVE,
	[ApiTokenStatus.EXPIRED]: ApiTokensMessage.STATUS_EXPIRED,
	[ApiTokenStatus.EXPIRING]: ApiTokensMessage.STATUS_EXPIRING,
} as const;

const STATUS_CLASS = {
	[ApiTokenStatus.ACTIVE]: "pill-active",
	[ApiTokenStatus.EXPIRED]: "pill-expired",
	[ApiTokenStatus.EXPIRING]: "pill-expiring",
} as const;

const ApiTokenRow: React.FC<Properties> = ({ onRevoke, token }: Properties) => {
	const handleRevoke = useCallback((): void => {
		onRevoke(token.id);
	}, [onRevoke, token.id]);

	const status = getTokenStatus(token.expiresAt);

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
				<span className={styles["row-expires"]}>
					{formatExpirationDate(token.expiresAt)}
				</span>
				<span className={styles["row-meta"]}>
					{getRelativeTimeLabel(token.expiresAt)}
				</span>
			</td>
			<td className={getValidClasses(styles["cell"], styles["cell-status"])}>
				<span
					className={getValidClasses(
						styles["pill"],
						styles[STATUS_CLASS[status]],
					)}
				>
					{STATUS_LABEL[status]}
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
