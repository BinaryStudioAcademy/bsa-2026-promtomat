import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Modal } from "~/libs/components/modal/modal.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useDeleteWorkspaceContributorMutation,
	useGetWorkspaceContributorsQuery,
} from "~/modules/workspaces/workspaces.js";

import { SOLO_MEMBER_COUNT } from "../../libs/constants/constants.js";
import { WorkspaceContributorsMessage } from "../../libs/enums/enums.js";
import { AddContributorForm } from "./components/add-contributor-form/add-contributor-form.js";
import { ContributorList } from "./components/contributor-list/contributor-list.js";
import styles from "./styles.module.css";

type Properties = {
	isOwner: boolean;
	onClose: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceContributorsModal: React.FC<Properties> = ({
	isOwner,
	onClose,
	workspace,
}: Properties) => {
	const { data, isError, isLoading, refetch } =
		useGetWorkspaceContributorsQuery(workspace.id);

	const [removeContributor, { isLoading: isRemoving }] =
		useDeleteWorkspaceContributorMutation();

	const contributors = data?.contributors;
	const members =
		data && !isError ? [data.owner, ...data.contributors] : undefined;
	const memberLabel =
		members?.length === SOLO_MEMBER_COUNT ? "member" : "members";
	const ownerLabel = isOwner ? "you" : data?.owner.nickname;
	const fallbackSubtitle = isOwner ? "Owned by you" : "Members";
	const subtitle =
		members && ownerLabel
			? `Owned by ${ownerLabel} · ${String(members.length)} ${memberLabel}`
			: fallbackSubtitle;

	const contributorCount =
		contributors && !isError ? String(contributors.length) : "–";
	const title = isOwner
		? `Manage Access: ${workspace.name}`
		: `Members: ${workspace.name}`;

	const handleRemove = useCallback(
		(userId: number): void => {
			void removeContributor({ userId, workspaceId: workspace.id });
		},
		[removeContributor, workspace.id],
	);

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	const removeHandler = isOwner ? handleRemove : undefined;

	return (
		<Modal
			footer={
				<Button
					label="Close"
					onClick={onClose}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			}
			isOpen
			onClose={onClose}
			subtitle={subtitle}
			title={title}
		>
			<div className={styles["body"]}>
				{isOwner && (
					<>
						<div className={styles["section"]}>
							<h3 className={styles["section-label"]}>
								Add a contributor by email or nickname
							</h3>
							<AddContributorForm workspaceId={workspace.id} />
						</div>

						<hr className={styles["divider"]} />
					</>
				)}
				<div className={styles["section"]}>
					<div className={styles["section-header"]}>
						<h3 className={styles["section-label"]}>Current contributors</h3>
						<span className={styles["count-badge"]}>{contributorCount}</span>
					</div>

					<ContributorList
						contributors={contributors}
						emptyMessage={WorkspaceContributorsMessage.NO_CONTRIBUTORS}
						errorMessage={WorkspaceContributorsMessage.CONTRIBUTORS_LOAD_FAILED}
						isError={isError}
						isLoading={isLoading}
						isRemoving={isRemoving}
						onRemove={removeHandler}
						onRetry={handleRetry}
					/>
				</div>
			</div>
		</Modal>
	);
};

export { WorkspaceContributorsModal };
