import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useGetUsersQuery } from "~/modules/users/users-api.js";

// Demo content proving the users API works end-to-end; replace with real Home content.
const Home: React.FC = () => {
	const { data: users, error, isLoading } = useGetUsersQuery(undefined);

	return (
		<>
			<h2>Users:</h2>
			{isLoading && (
				<Loader label="Loading users" variant={LoaderVariant.SECTION} />
			)}
			{isServerError(error) && <p>{error.message}</p>}
			<ul>
				{users?.items.map((user) => (
					<li key={user.id}>{user.email}</li>
				))}
			</ul>
		</>
	);
};

export { Home };
