import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { Input } from "~/libs/components/input/input.js";
import {
	LoaderColor,
	LoaderSize,
	LoaderVariant,
} from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import {
	useAddWorkspaceContributorMutation,
	useGetWorkspaceContributorCandidatesInfiniteQuery,
} from "~/modules/workspaces/workspaces.js";

import { CandidateItem } from "../candidate-item/candidate-item.js";
import { UserList } from "../user-list/user-list.js";
import { CandidateSearchMessage } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	workspaceId: number;
};

const CandidateSearch: React.FC<Properties> = ({ workspaceId }: Properties) => {
	const { control, debouncedSearch } = useSearch();
	const userQuery = debouncedSearch.trim();
	const noteId = useId();
	const sentinelReference = useRef<HTMLLIElement>(null);

	const {
		data,
		direction,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetchingNextPage,
		isLoading,
		refetch,
	} = useGetWorkspaceContributorCandidatesInfiniteQuery({
		userQuery,
		workspaceId,
	});

	const [addContributor] = useAddWorkspaceContributorMutation();
	const [pendingUserIds, setPendingUserIds] = useState<number[]>([]);

	const candidates = data?.pages.flatMap((page) => page.items);
	const hasNoCandidates = candidates?.length === EMPTY_LENGTH;
	const hasUserQuery = userQuery.length > EMPTY_LENGTH;
	const emptyMessage = hasUserQuery
		? `No users found matching “${userQuery}”.`
		: CandidateSearchMessage.NO_CANDIDATES;
	const isFetchNextPageError = isError && direction === "forward";
	const hasListError = isError && !isFetchNextPageError;

	const handleRemovePendingUserId = useCallback((userId: number): void => {
		setPendingUserIds((previous) =>
			previous.filter((pendingId) => pendingId !== userId),
		);
	}, []);

	const handleAdd = useCallback(
		(userId: number): void => {
			setPendingUserIds((previous) => [...previous, userId]);

			void addContributor({ payload: { userId }, workspaceId }).finally(() => {
				handleRemovePendingUserId(userId);
			});
		},
		[addContributor, handleRemovePendingUserId, workspaceId],
	);

	const handleRetry = useCallback((): void => {
		void refetch();
	}, [refetch]);

	const handleLoadMoreRetry = useCallback((): void => {
		void fetchNextPage();
	}, [fetchNextPage]);

	useEffect(() => {
		const sentinelElement = sentinelReference.current;

		if (
			sentinelElement === null ||
			!hasNextPage ||
			isFetchingNextPage ||
			isFetchNextPageError
		) {
			return;
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				void fetchNextPage();
			}
		});

		observer.observe(sentinelElement);

		return () => {
			observer.disconnect();
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

	return (
		<div className={styles["search"]}>
			<Input
				control={control}
				descriptionId={noteId}
				isLabelHidden
				label="Search users"
				name="search"
				placeholder={CandidateSearchMessage.SEARCH_PLACEHOLDER}
			/>

			<UserList
				emptyMessage={emptyMessage}
				errorMessage={CandidateSearchMessage.USERS_LOAD_FAILED}
				isEmpty={hasNoCandidates}
				isError={hasListError}
				isLoading={isLoading}
				onRetry={handleRetry}
			>
				{candidates?.map((candidate) => {
					return (
						<CandidateItem
							isDisabled={pendingUserIds.includes(candidate.id)}
							key={candidate.id}
							onAdd={handleAdd}
							user={candidate}
						/>
					);
				})}
				{hasNextPage && !isFetchNextPageError && (
					<li
						aria-hidden="true"
						className={styles["sentinel"]}
						ref={sentinelReference}
					/>
				)}

				{isFetchingNextPage && (
					<li className={styles["page-status"]}>
						<Loader
							color={LoaderColor.NEUTRAL}
							label="Loading more users"
							size={LoaderSize.SMALL}
							variant={LoaderVariant.INLINE}
						/>
					</li>
				)}

				{isFetchNextPageError && (
					<li className={styles["page-error"]}>
						{CandidateSearchMessage.USERS_LOAD_FAILED}
						<Button
							label="Retry"
							onClick={handleLoadMoreRetry}
							size={ControlSize.SM}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</li>
				)}
			</UserList>

			<p className={styles["note"]} id={noteId}>
				<Icon className={styles["note-icon"]} iconName={IconName.INFO} />
				{CandidateSearchMessage.NO_ACCOUNT_HINT}
			</p>
		</div>
	);
};

export { CandidateSearch };
