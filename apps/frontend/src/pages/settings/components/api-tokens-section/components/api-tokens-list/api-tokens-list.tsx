import { ApiTokenDto } from "~/modules/api-tokens/api-tokens.js";

import { EMPTY_TOKEN_LEN } from "../../libs/constants/constants.js";
import styles from "../../styles.module.css";
import { ApiTokenRow } from "../api-token-row/api-token-row.js";

type Properties = {
	handleRevoke: (id: string) => void;
	tokens: ApiTokenDto[] | undefined;
};

const ApiTokensList = ({ handleRevoke, tokens }: Properties) => {
	if (!(tokens && tokens.length > EMPTY_TOKEN_LEN)) {
		return null;
	}

	return (
		<ul className={styles["list"]}>
			{tokens.map((token) => (
				<ApiTokenRow key={token.id} onRevoke={handleRevoke} token={token} />
			))}
		</ul>
	);
};

export { ApiTokensList };
