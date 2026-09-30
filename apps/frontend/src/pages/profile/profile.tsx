import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { PageContainer } from "~/libs/components/page-container/page-container.js";
import { PageIntro } from "~/libs/components/page-intro/page-intro.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";
import { useGetProfileSummaryQuery } from "~/modules/users/users-api.js";

import { Activity } from "./components/activity/activity.js";
import { Security } from "./components/security/security.js";
import { SettingsForm } from "./components/settings-form/settings-form.js";
import styles from "./styles.module.css";

const Profile: React.FC = () => {
	const { data: user, isLoading: isLoadingUser } =
		useGetAuthenticatedUserQuery(undefined);
	const { data: summary, isLoading: isLoadingSummary } =
		useGetProfileSummaryQuery(undefined);

	if (isLoadingUser || isLoadingSummary || !user || !summary) {
		return (
			<PageContainer>
				<div className={styles["page"]}>
					<Loader label="Loading profile" variant={LoaderVariant.SECTION} />
				</div>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<div className={styles["page"]}>
				<PageIntro label="Account" title="Profile" />
				<SettingsForm totalPrompts={summary.totalPrompts} user={user} />
				<Activity
					averageScore={summary.averageScore}
					currentStreak={summary.currentStreak}
					totalPrompts={summary.totalPrompts}
				/>
				<Security email={user.email} />
			</div>
		</PageContainer>
	);
};

export { Profile };
