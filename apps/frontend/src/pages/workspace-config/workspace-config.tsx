import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { HTTPCode } from "~/libs/enums/enums.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useGetWorkspaceByIdQuery } from "~/modules/workspaces/workspaces.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import { WorkspaceConfigMessage } from "./libs/enums/enums.js";

const WorkspaceConfig: React.FC = () => {
	const { workspaceId } = useParams<{ workspaceId?: string }>();
	const parsedWorkspaceId = Number(workspaceId);

	const { data, error, isLoading, refetch } =
		useGetWorkspaceByIdQuery(parsedWorkspaceId);

	const isNotFound =
		isServerError(error) && error.status === HTTPCode.NOT_FOUND;

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	if (isLoading) {
		return <Loader variant={LoaderVariant.SECTION} />;
	}

	if (isNotFound) {
		return <NotFoundPage />;
	}

	if (!data) {
		return (
			<div className="page-container">
				<p>{WorkspaceConfigMessage.LOAD_FAILED}</p>
				<Button label="Retry" onClick={handleRetry} type="button" />
			</div>
		);
	}

	return (
		<div className="page-container">
			<h2>{data.name}</h2>
		</div>
	);
};

export { WorkspaceConfig };
