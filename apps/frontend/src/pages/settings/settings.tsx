import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

import { SecurityCard } from "./components/security-card/security-card.js";
import { SettingsForm } from "./components/settings-form/settings-form.js";
import styles from "./styles.module.css";

const SettingsPage: React.FC = () => {
	const { data: user, isLoading } = useGetAuthenticatedUserQuery(undefined);

	if (isLoading || !user) {
		return (
			<main className={styles["page"]}>
				<Loader label="Loading profile" variant={LoaderVariant.SECTION} />
			</main>
		);
	}

	return (
		<main className={styles["page"]}>
			<div className={getValidClasses("page-container", styles["container"])}>
				<p className={styles["kicker"]}>ACCOUNT</p>
				<h1 className={styles["title"]}>User settings</h1>
				<div className={styles["content"]}>
					<SettingsForm user={user} />
					<SecurityCard email={user.email} />
				</div>
			</div>
		</main>
	);
};

export { SettingsPage };
