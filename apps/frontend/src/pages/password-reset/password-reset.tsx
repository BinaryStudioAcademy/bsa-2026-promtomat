import { useLocation } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";

import { ForgotPasswordForm } from "./components/forgot-password-form/forgot-password-form.js";
import { NewPasswordForm } from "./components/new-password-form/new-password-form.js";
import styles from "./styles.module.css";

const PasswordReset: React.FC = () => {
	const { pathname } = useLocation();

	return (
		<main className={styles["page"]}>
			<div className={styles["glow-accent-top"]} />
			<div className={styles["glow-info-bottom"]} />
			<div className={styles["glow-accent-bottom"]} />
			<div className={styles["lift"]} />

			<div className={styles["card"]}>
				{pathname === AppRoute.RESET_PASSWORD ? (
					<NewPasswordForm />
				) : (
					<ForgotPasswordForm />
				)}
			</div>
		</main>
	);
};

export { PasswordReset };
