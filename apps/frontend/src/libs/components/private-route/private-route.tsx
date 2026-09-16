import { Navigate, Outlet } from "react-router-dom";

import { Header } from "~/libs/components/header/header.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

type Properties = {
	redirectTo: ValueOf<typeof AppRoute>;
};

const PrivateRoute: React.FC<Properties> = ({ redirectTo }: Properties) => {
	const { data: user, isLoading } = useGetAuthenticatedUserQuery(undefined);

	if (isLoading) {
		return <Loader />;
	}

	if (!user) {
		return <Navigate to={redirectTo} />;
	}

	return (
		<>
			<Header isLoading={false} user={user} />
			<main>
				<Outlet />
			</main>
		</>
	);
};

export { PrivateRoute };
