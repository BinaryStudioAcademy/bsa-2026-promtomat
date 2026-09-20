import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { useGetProfileSummaryQuery } from "~/modules/users/users-api.js";

import { Activity } from "./components/activity/activity.js";
import { Security } from "./components/security/security.js";
import { SettingsForm } from "./components/settings-form/settings-form.js";
import styles from "./styles.module.css";

const SettingsPage: React.FC = () => {
	const { data: user, isLoading: isLoadingUser } =
		useGetAuthenticatedUserQuery(undefined);
	const { data: summary, isLoading: isLoadingSummary } =
		useGetProfileSummaryQuery(undefined);

	if (isLoadingUser || isLoadingSummary || !user || !summary) {
		return (
			<main className={styles["page"]}>
				<Loader label="Loading profile" variant={LoaderVariant.SECTION} />
			</main>
		);
	}

	return (
		<main className={styles["page"]}>
			<span className={styles["kicker"]}>ACCOUNT</span>
			<h1 className={styles["title"]}>Profile</h1>
			<SettingsForm user={{ ...user, totalPrompts: summary.totalPrompts }} />
			<Activity summary={summary} />
			<Security />
		</main>
	);
};

export { SettingsPage };
