import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";

import { ApiTokensMessage } from "../../libs/enums/enums.js";

type Properties = {
	isLoading: boolean;
};

const LoadingIndicator = ({ isLoading }: Properties) => {
	if (!isLoading) {
		return null;
	}

	return (
		<Loader label={ApiTokensMessage.LOADING} variant={LoaderVariant.SECTION} />
	);
};

export { LoadingIndicator };
