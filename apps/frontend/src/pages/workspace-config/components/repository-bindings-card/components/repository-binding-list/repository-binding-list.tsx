import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type RepositoryBindingDto } from "~/modules/repository-bindings/libs/types/types.js";

import { RepositoryBindingItem } from "../repository-binding-item/repository-binding-item.js";
import styles from "./styles.module.css";

type Properties = {
	bindings: RepositoryBindingDto[];
	emptyMessage: string;
	emptySubtitle?: string;
	errorMessage?: string;
	isError?: boolean;
	isLoading: boolean;
	isOwner: boolean;
	isRemoving?: boolean;
	onRemove: (repositoryBindingId: number) => void;
	onRetry?: () => void;
};

const RepositoryBindingList: React.FC<Properties> = ({
	bindings,
	emptyMessage,
	emptySubtitle,
	errorMessage,
	isError = false,
	isLoading,
	isOwner,
	isRemoving = false,
	onRemove,
	onRetry,
}: Properties) => {
	const isEmpty = bindings.length === EMPTY_LENGTH;
	const hasErrorMessage = !isLoading && isError;
	const hasEmptyMessage = !isLoading && !isError && isEmpty;
	const hasItems = !isLoading && !isError && !isEmpty;

	return (
		<ul className={styles["list"]}>
			{isLoading && (
				<li className={styles["state"]}>
					<Loader variant={LoaderVariant.SECTION} />
				</li>
			)}

			{hasErrorMessage && (
				<li className={getValidClasses(styles["state"], styles["error"])}>
					{errorMessage}
					{onRetry && (
						<Button
							label="Retry"
							onClick={onRetry}
							size={ControlSize.SM}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					)}
				</li>
			)}

			{hasEmptyMessage && (
				<li className={getValidClasses(styles["state"], styles["empty"])}>
					<div className={styles["empty-state"]}>
						<p className={styles["empty-state-text"]}>{emptyMessage}</p>
						{emptySubtitle && (
							<p className={styles["empty-state-subtext"]}>{emptySubtitle}</p>
						)}
					</div>
				</li>
			)}

			{hasItems &&
				bindings.map((binding) => {
					return (
						<RepositoryBindingItem
							binding={binding}
							isDisabled={isRemoving}
							isOwner={isOwner}
							key={binding.id}
							onRemove={onRemove}
						/>
					);
				})}
		</ul>
	);
};

export { RepositoryBindingList };
