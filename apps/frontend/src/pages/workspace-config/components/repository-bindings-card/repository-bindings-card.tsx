import { useCallback } from "react";

import {
	useDeleteRepositoryBindingMutation,
	useGetRepositoryBindingsQuery,
} from "~/modules/repository-bindings/repository-bindings.js";

import { WorkspaceRepositoryBindingsMessage } from "../../libs/enums/enums.js";
import pageStyles from "../../styles.module.css";
import { RepositoryBindingList } from "./components/repository-binding-list/repository-binding-list.js";

type Properties = {
	workspaceId: number;
};

const RepositoryBindingsCard: React.FC<Properties> = ({
	workspaceId,
}: Properties) => {
	const {
		data: bindings,
		isError: isBindingsError,
		isLoading: isBindingsLoading,
		refetch: refetchBindings,
	} = useGetRepositoryBindingsQuery(workspaceId);
	const [removeRepositoryBinding, { isLoading: isRemovingBinding }] =
		useDeleteRepositoryBindingMutation();

	const handleRemoveBinding = useCallback(
		(repositoryBindingId: number): void => {
			void removeRepositoryBinding(repositoryBindingId);
		},
		[removeRepositoryBinding],
	);

	const handleRetryBindings = useCallback((): void => {
		void refetchBindings();
	}, [refetchBindings]);

	const bindingList = bindings ?? [];

	return (
		<section className={pageStyles["card"]}>
			<h3 className={pageStyles["section-title"]}>Bound repositories</h3>
			<RepositoryBindingList
				bindings={bindingList}
				emptyMessage={WorkspaceRepositoryBindingsMessage.NO_REPOSITORY_BINDINGS}
				errorMessage={
					WorkspaceRepositoryBindingsMessage.REPOSITORY_BINDINGS_LOAD_FAILED
				}
				isError={isBindingsError}
				isLoading={isBindingsLoading}
				isRemoving={isRemovingBinding}
				onRemove={handleRemoveBinding}
				onRetry={handleRetryBindings}
			/>
		</section>
	);
};

export { RepositoryBindingsCard };
