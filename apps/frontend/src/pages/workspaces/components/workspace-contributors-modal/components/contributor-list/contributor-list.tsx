import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/get-valid-classes.helper.js";
import { type WorkspaceUserSummaryDto } from "~/modules/workspaces/libs/types/types.js";

import { ContributorItem } from "../contributor-item/contributor-item.js";
import styles from "./styles.module.css";

type Properties = {
	contributors?: undefined | WorkspaceUserSummaryDto[];
	emptyMessage: string;
	errorMessage?: string;
	isError?: boolean;
	isLoading: boolean;
	isOwner: boolean;
	isRemoving?: boolean;
	onRemove: (userId: number) => void;
	onRetry?: () => void;
};

const ContributorList: React.FC<Properties> = ({
	contributors = [],
	emptyMessage,
	errorMessage,
	isError = false,
	isLoading,
	isOwner,
	isRemoving = false,
	onRemove,
	onRetry,
}: Properties) => {
	const isEmpty = contributors.length === EMPTY_LENGTH;
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
				contributors.map((contributor) => {
					return (
						<ContributorItem
							isDisabled={isRemoving}
							isOwner={isOwner}
							key={contributor.id}
							onRemove={onRemove}
							user={contributor}
						/>
					);
				})}
		</ul>
	);
};

export { ContributorList };
