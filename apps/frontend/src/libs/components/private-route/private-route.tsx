import { Navigate } from "react-router-dom";

import { Header } from "~/libs/components/header/header.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

type Properties = {
	children: React.ReactNode;
	redirectTo: ValueOf<typeof AppRoute>;
};

const PrivateRoute: React.FC<Properties> = ({
	children,
	redirectTo,
}: Properties) => {
	const { data: user, isLoading } = useGetAuthenticatedUserQuery(undefined);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <Navigate to={redirectTo} />;
	}

	return (
		<>
			<Header isLoading={false} user={user} />
			<main>{children}</main>
		</>
	);
};

export { PrivateRoute };
