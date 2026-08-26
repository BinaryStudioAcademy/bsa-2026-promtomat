import { Navigate, Outlet } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

const PrivateRoutes: React.FC = () => {
	const {
		data: user,
		error,
		isLoading,
	} = useGetAuthenticatedUserQuery(undefined);

	let content: React.ReactNode;

	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (user) {
		content = <Outlet />;
	} else {
		content = <Navigate to={AppRoute.SIGN_IN} />;
	}

	return (
		<>
			{content}
			{error && <p>{error.message}</p>}
		</>
	);
};

export { PrivateRoutes };
