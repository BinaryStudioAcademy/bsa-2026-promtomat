import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { Link } from "~/libs/components/link/link.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";
import { ProgressBar } from "~/libs/components/progress-bar/progress-bar.js";
import { AppRoute, HTTPCode, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { PromptProgress } from "~/modules/prompts/prompts.js";
import { useGetWorkspaceByIdQuery } from "~/modules/workspaces/workspaces.js";
import { NotFoundPage } from "~/pages/not-found/not-found.js";

import { AccessCard } from "./components/access-card/access-card.js";
import { DangerZone } from "./components/danger-zone/danger-zone.js";
import { WorkspaceConfigForm } from "./components/workspace-config-form/workspace-config-form.js";
import { WorkspaceConfigMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

const WorkspaceConfig: React.FC = () => {
	const { workspaceId } = useParams<{ workspaceId?: string }>();
	const parsedWorkspaceId = Number(workspaceId);

	const { data: user } = useGetAuthenticatedUserQuery(undefined);
	const {
		data: workspace,
		error,
		isFetching,
		isLoading,
		refetch,
	} = useGetWorkspaceByIdQuery(parsedWorkspaceId);

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

	const pageClassName = getValidClasses("page-container", styles["page"]);

	if (!workspace) {
		return (
			<div className={pageClassName}>
				<p>{WorkspaceConfigMessage.LOAD_FAILED}</p>
				<Button
					isLoading={isFetching}
					label="Retry"
					onClick={handleRetry}
					type="button"
				/>
			</div>
		);
	}

	const isOwner = workspace.userId === user?.id;
	const containerClassName = getValidClasses(
		"page-container",
		styles["container"],
	);

	return (
		<div className={styles["page"]}>
			<div className={containerClassName}>
				<Link
					className={styles["back-link"]}
					hasDefaultStyles={false}
					to={AppRoute.WORKSPACES}
				>
					<Icon className={styles["back-icon"]} iconName={IconName.CHEVRON} />
					All workspaces
				</Link>
				<PageIntro label="Workspace config" title={workspace.name} />
				<section className={styles["card"]}>
					<h3 className={styles["section-title"]}>General</h3>
					<WorkspaceConfigForm isOwner={isOwner} workspace={workspace} />
				</section>
				<section className={styles["card"]}>
					<h3 className={styles["section-title"]}>Dataset target</h3>
					<ProgressBar
						count={workspace.promptCount}
						label="Dataset readiness"
						target={PromptProgress.TARGET_COUNT}
					/>
				</section>
				{user && (
					<AccessCard
						currentUserId={user.id}
						isOwner={isOwner}
						workspace={workspace}
					/>
				)}

				{isOwner && <DangerZone workspace={workspace} />}
			</div>
		</div>
	);
};

export { WorkspaceConfig };
