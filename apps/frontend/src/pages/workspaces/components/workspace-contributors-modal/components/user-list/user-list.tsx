import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/get-valid-classes.helper.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	emptyMessage: string;
	errorMessage?: string;
	isEmpty: boolean;
	isError?: boolean;
	isLoading: boolean;
	onRetry?: () => void;
};

const UserList: React.FC<Properties> = ({
	children,
	emptyMessage,
	errorMessage,
	isEmpty,
	isError = false,
	isLoading,
	onRetry,
}: Properties) => {
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

			{hasItems && children}
		</ul>
	);
};

export { UserList };
