import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "~/libs/components/button/button.js";
import {
	AppRoute,
	ButtonVariant,
	ControlSize,
	IconName,
} from "~/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useDeleteWorkspaceContributorMutation,
	useGetWorkspaceContributorsQuery,
} from "~/modules/workspaces/workspaces.js";

import {
	WorkspaceContributorsMessage,
	WorkspaceLeaveMessage,
} from "../../libs/enums/enums.js";
import { getAccessCardValues } from "../../libs/helpers/helpers.js";
import pageStyles from "../../styles.module.css";
import { WorkspaceLeaveModal } from "../workspace-leave-modal/workspace-leave-modal.js";
import { AddContributorForm } from "./components/add-contributor-form/add-contributor-form.js";
import { ContributorList } from "./components/contributor-list/contributor-list.js";
import {
	INITIAL_STATUS_MESSAGE_KEY,
	STATUS_MESSAGE_KEY_STEP,
} from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	currentUserId: number;
	isOwner: boolean;
	workspace: WorkspaceListItemDto;
};

const AccessCard: React.FC<Properties> = ({
	currentUserId,
	isOwner,
	workspace,
}: Properties) => {
	const navigate = useNavigate();
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
	const [statusMessageKey, setStatusMessageKey] = useState(
		INITIAL_STATUS_MESSAGE_KEY,
	);
	const [statusMessage, setStatusMessage] = useState("");

	const {
		data: contributorsResponse,
		isError,
		isLoading,
		refetch,
	} = useGetWorkspaceContributorsQuery(workspace.id);
	const [removeContributor, { isLoading: isRemoving }] =
		useDeleteWorkspaceContributorMutation();

	const { contributorCountLabel, contributors, subtitle } = getAccessCardValues(
		{
			contributorsResponse,
			isError,
			isOwner,
		},
	);

	const announce = useCallback((message: string): void => {
		setStatusMessageKey((previous) => previous + STATUS_MESSAGE_KEY_STEP);
		setStatusMessage(message);
	}, []);

	const handleAdded = useCallback((): void => {
		announce(WorkspaceContributorsMessage.CONTRIBUTOR_ADDED);
	}, [announce]);

	const handleRemove = useCallback(
		(userId: number): void => {
			if (!isOwner) {
				return;
			}

			void removeContributor({ userId, workspaceId: workspace.id }).then(
				({ error }) => {
					const hasError = Boolean(error);

					if (!hasError) {
						announce(WorkspaceContributorsMessage.CONTRIBUTOR_REMOVED);
					}
				},
			);
		},
		[announce, isOwner, removeContributor, workspace.id],
	);

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	const handleLeaveOpen = useCallback((): void => {
		setIsLeaveModalOpen(true);
	}, []);

	const handleLeaveClose = useCallback((): void => {
		setIsLeaveModalOpen(false);
	}, []);

	const handleLeft = useCallback((): void => {
		void navigate(AppRoute.WORKSPACES);
	}, [navigate]);

	return (
		<section className={pageStyles["card"]} id="access">
			<div className={styles["header"]}>
				<div className={styles["heading"]}>
					<h3 className={pageStyles["section-title"]}>Access</h3>
					<p className={styles["subtitle"]}>{subtitle}</p>
				</div>
				{!isOwner && (
					<Button
						className={styles["leave-button"]}
						iconName={IconName.LOG_OUT}
						label={WorkspaceLeaveMessage.LEAVE}
						onClick={handleLeaveOpen}
						size={ControlSize.MD}
						type="button"
						variant={ButtonVariant.SECONDARY}
					/>
				)}
			</div>
			<p className="visually-hidden" role="status">
				<span key={statusMessageKey}>{statusMessage}</span>
			</p>
			{isOwner && (
				<>
					<div className={styles["section"]}>
						<h4 className={styles["label"]}>
							Add a contributor by email or nickname
						</h4>
						<AddContributorForm
							onSuccess={handleAdded}
							workspaceId={workspace.id}
						/>
					</div>
					<hr className={styles["divider"]} />
				</>
			)}
			<div className={styles["section"]}>
				<div className={styles["section-header"]}>
					<h4 className={styles["label"]}>Current contributors</h4>
					<span className={styles["count"]}>{contributorCountLabel}</span>
				</div>
				<ContributorList
					contributors={contributors}
					emptyMessage={WorkspaceContributorsMessage.NO_CONTRIBUTORS}
					errorMessage={WorkspaceContributorsMessage.CONTRIBUTORS_LOAD_FAILED}
					isError={isError}
					isLoading={isLoading}
					isOwner={isOwner}
					isRemoving={isRemoving}
					onRemove={handleRemove}
					onRetry={handleRetry}
				/>
			</div>
			{isLeaveModalOpen && (
				<WorkspaceLeaveModal
					currentUserId={currentUserId}
					onClose={handleLeaveClose}
					onSuccess={handleLeft}
					workspace={workspace}
				/>
			)}
		</section>
	);
};

export { AccessCard };
