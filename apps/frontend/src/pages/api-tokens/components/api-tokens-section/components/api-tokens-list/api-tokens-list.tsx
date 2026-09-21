import { type ApiTokenDto } from "~/modules/api-tokens/api-tokens.js";

import { EMPTY_TOKEN_LEN } from "../../libs/constants/constants.js";
import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import { ApiTokenRow } from "../api-token-row/api-token-row.js";

type Properties = {
	handleRevoke: (id: string) => void;
	tokens: ApiTokenDto[] | undefined;
};

const COLUMNS = [
	ApiTokensMessage.COLUMN_NAME,
	ApiTokensMessage.COLUMN_LAST_USED,
	ApiTokensMessage.COLUMN_EXPIRES,
	ApiTokensMessage.COLUMN_STATUS,
] as const;

const ApiTokensList = ({ handleRevoke, tokens }: Properties) => {
	if (!(tokens && tokens.length > EMPTY_TOKEN_LEN)) {
		return null;
	}

	return (
		<table className={styles["table"]}>
			<thead className={styles["thead"]}>
				<tr>
					{COLUMNS.map((column) => (
						<th className={styles["th"]} key={column} scope="col">
							{column}
						</th>
					))}
					<th className={styles["th"]} scope="col">
						<span className="visually-hidden">
							{ApiTokensMessage.COLUMN_ACTIONS}
						</span>
					</th>
				</tr>
			</thead>
			<tbody className={styles["tbody"]}>
				{tokens.map((token) => (
					<ApiTokenRow key={token.id} onRevoke={handleRevoke} token={token} />
				))}
			</tbody>
		</table>
	);
};

export { ApiTokensList };
