import { type ValueOf } from "@promptomat/shared";
import { Navigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

type Properties = {
	children: React.ReactNode;
	redirectTo: ValueOf<typeof AppRoute>;
};

const PrivateRoute: React.FC<Properties> = ({
	children,
	redirectTo,
}: Properties) => {
	const {
		data: user,
		error,
		isLoading,
	} = useGetAuthenticatedUserQuery(undefined);

	let content: React.ReactNode;

	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (user) {
		content = children;
	} else {
		content = <Navigate to={redirectTo} />;
	}
	return (
		<>
			{isServerError(error) && <p>{error.message}</p>}
			{content}
		</>
	);
};

export { PrivateRoute };
