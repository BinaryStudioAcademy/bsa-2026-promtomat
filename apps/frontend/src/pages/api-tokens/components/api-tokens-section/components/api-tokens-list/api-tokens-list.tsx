import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { type ApiTokenDto } from "~/modules/api-tokens/api-tokens.js";

import { API_TOKENS_TABLE_COLUMNS } from "../../libs/constants/constants.js";
import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";
import { ApiTokenRow } from "../api-token-row/api-token-row.js";
import { EmptyTokenListPlaceholder } from "../empty-toknes-list-placeholder/empty-toknes-list-placeholder.js";

type Properties = {
	handleRevoke: (id: string) => void;
	tokens: ApiTokenDto[];
};

const ApiTokensList: React.FC<Properties> = ({
	handleRevoke,
	tokens,
}: Properties) => {
	if (tokens.length === EMPTY_LENGTH) {
		return <EmptyTokenListPlaceholder />;
	}

	return (
		<table className={styles["table"]}>
			<thead className={styles["thead"]}>
				<tr>
					{API_TOKENS_TABLE_COLUMNS.map((column) => (
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
