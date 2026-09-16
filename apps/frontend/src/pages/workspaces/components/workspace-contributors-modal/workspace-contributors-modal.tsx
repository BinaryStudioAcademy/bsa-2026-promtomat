import { useCallback } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Modal } from "~/libs/components/modal/modal.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { type WorkspaceListItemDto } from "~/modules/workspaces/libs/types/types.js";
import {
	useDeleteWorkspaceContributorMutation,
	useGetWorkspaceContributorsQuery,
} from "~/modules/workspaces/workspaces.js";

import { SOLO_MEMBER_COUNT } from "../../libs/constants/constants.js";
import { WorkspaceContributorsMessage } from "../../libs/enums/enums.js";
import { ContributorItem } from "./components/contributor-item/contributor-item.js";
import { UserList } from "./components/user-list/user-list.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
	workspace: WorkspaceListItemDto;
};

const WorkspaceContributorsModal: React.FC<Properties> = ({
	onClose,
	workspace,
}: Properties) => {
	const { data, isError, isLoading, refetch } =
		useGetWorkspaceContributorsQuery(workspace.id);

	const [removeContributor, { isLoading: isRemoving }] =
		useDeleteWorkspaceContributorMutation();

	const contributors = data?.contributors;
	const hasNoContributors = contributors?.length === EMPTY_LENGTH;
	const memberLabel =
		workspace.memberCount === SOLO_MEMBER_COUNT ? "member" : "members";
	const subtitle = contributors
		? `Owned by you · ${String(workspace.memberCount)} ${memberLabel}`
		: "Owned by you";
	const contributorCount = contributors ? String(contributors.length) : "–";
	const title = `Manage Access: ${workspace.name}`;

	const handleRemove = useCallback(
		(userId: number): void => {
			void removeContributor({ userId, workspaceId: workspace.id });
		},
		[removeContributor, workspace.id],
	);

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

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
				<h3 className={styles["section-label"]}>Find a user</h3>

				<hr className={styles["divider"]} />
				<div className={styles["section"]}>
					<div className={styles["section-header"]}>
						<h3 className={styles["section-label"]}>Current contributors</h3>
						<span className={styles["count-badge"]}>{contributorCount}</span>
					</div>

					<UserList
						emptyMessage={WorkspaceContributorsMessage.NO_CONTRIBUTORS}
						errorMessage={WorkspaceContributorsMessage.LOAD_FAILED}
						isEmpty={hasNoContributors}
						isError={isError}
						isLoading={isLoading}
						onRetry={handleRetry}
					>
						{contributors?.map((contributor) => {
							return (
								<ContributorItem
									isDisabled={isRemoving}
									key={contributor.id}
									onRemove={handleRemove}
									user={contributor}
								/>
							);
						})}
					</UserList>
				</div>
			</div>
		</Modal>
	);
};

export { WorkspaceContributorsModal };
