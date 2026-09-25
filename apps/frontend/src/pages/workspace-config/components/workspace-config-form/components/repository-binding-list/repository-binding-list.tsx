import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/get-valid-classes.helper.js";
import { type RepositoryBindingDto } from "~/modules/repository-bindings/libs/types/types.js";

import { RepositoryBindingItem } from "../repository-binding-item/repository-binding-item.js";
import styles from "./styles.module.css";

type Properties = {
	bindings: RepositoryBindingDto[];
	emptyMessage: string;
	errorMessage?: string;
	isError?: boolean;
	isLoading: boolean;
	isRemoving?: boolean;
	onRemove: (repositoryBindingId: number) => void;
	onRetry?: () => void;
};

const RepositoryBindingList: React.FC<Properties> = ({
	bindings,
	emptyMessage,
	errorMessage,
	isError = false,
	isLoading,
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
					{emptyMessage}
				</li>
			)}

			{hasItems &&
				bindings.map((binding) => {
					return (
						<RepositoryBindingItem
							binding={binding}
							isDisabled={isRemoving}
							key={binding.id}
							onRemove={onRemove}
						/>
					);
				})}
		</ul>
	);
};

export { RepositoryBindingList };
