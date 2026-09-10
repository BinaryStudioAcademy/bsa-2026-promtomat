import { Button } from "~/libs/components/button/button.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetAuthenticatedUserQuery } from "~/modules/auth/auth-api.js";

import { SettingsForm } from "./components/settings-form/settings-form.js";
import { SettingsMessage } from "./libs/enums/enums.js";
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
					<section className={styles["card"]}>
						<h2 className={styles["section-title"]}>SECURITY</h2>
						<Button
							label={SettingsMessage.RESET_PASSWORD}
							size={ControlSize.LG}
							type="button"
							variant={ButtonVariant.SECONDARY}
						/>
					</section>
				</div>
			</div>
		</main>
	);
};

export { SettingsPage };
