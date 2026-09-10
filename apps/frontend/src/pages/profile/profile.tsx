import { Navigate } from "react-router-dom";

import { FormAlert } from "~/libs/components/form-alert/form-alert.js";
import { Link } from "~/libs/components/link/link.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { AppRoute, ErrorCode } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { isServerError } from "~/libs/modules/api/libs/helpers/is-server-error.helper.js";
import { useGetProfileSummaryQuery } from "~/modules/users/users-api.js";

import styles from "./styles.module.css";

const NO_PROMPTS_COUNT = 0;
const MEMBER_SINCE_DATE_FORMAT: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "short",
	year: "numeric",
};

const Profile: React.FC = () => {
	const { data, error, isLoading } = useGetProfileSummaryQuery(undefined);

	if (isLoading) {
		return (
			<main className={styles["page"]}>
				<Loader label="Loading profile" variant={LoaderVariant.SECTION} />
			</main>
		);
	}

	if (isServerError(error) && error.code === ErrorCode.AUTH_USER_NOT_FOUND) {
		return <Navigate replace to={AppRoute.SIGN_IN} />;
	}

	if (!data) {
		return (
			<main className={styles["page"]}>
				<div className={getValidClasses("page-container", styles["container"])}>
					{error ? (
						<FormAlert error={error} />
					) : (
						<FormAlert message="Couldn't load your profile." />
					)}
				</div>
			</main>
		);
	}

	const {
		averageScore,
		id,
		memberSince,
		nickname,
		primaryAiCodingTool,
		totalPrompts,
	} = data;
	const hasPrompts = totalPrompts > NO_PROMPTS_COUNT;
	const memberSinceLabel = new Date(memberSince).toLocaleDateString(
		undefined,
		MEMBER_SINCE_DATE_FORMAT,
	);
	const primaryAiCodingToolLabel = primaryAiCodingTool ?? "Not specified";

	return (
		<main className={styles["page"]}>
			<div className={getValidClasses("page-container", styles["container"])}>
				<p className={styles["kicker"]}>ACCOUNT</p>
				<h2 className={styles["title"]}>Profile</h2>

				<div className={styles["content"]}>
					<section className={styles["card"]}>
						<div className={styles["detail-row"]}>
							<span className={styles["detail-label"]}>ID</span>
							<span className={styles["detail-value"]}>{id}</span>
						</div>
						<div className={styles["detail-row"]}>
							<span className={styles["detail-label"]}>Nickname</span>
							<Link
								className={styles["detail-value-link"]}
								to={AppRoute.SETTINGS}
							>
								<span className={styles["detail-value-link-text"]}>
									{nickname}
								</span>
								<span className={styles["detail-value-hint"]}>Edit</span>
							</Link>
						</div>
						<div className={styles["detail-row"]}>
							<span className={styles["detail-label"]}>
								Primary AI coding tool
							</span>
							<Link
								className={styles["detail-value-link"]}
								to={AppRoute.SETTINGS}
							>
								<span className={styles["detail-value-link-text"]}>
									{primaryAiCodingToolLabel}
								</span>
								<span className={styles["detail-value-hint"]}>Edit</span>
							</Link>
						</div>
						<div className={styles["detail-row"]}>
							<span className={styles["detail-label"]}>Member since</span>
							<span className={styles["detail-value"]}>
								{memberSinceLabel}
							</span>
						</div>
					</section>

					<section className={styles["card"]}>
						<h3 className={styles["section-title"]}>Your prompt activity</h3>
						{hasPrompts ? (
							<div className={styles["stats-grid"]}>
								<div className={styles["stat-tile"]}>
									<span className={styles["stat-value"]}>
										{totalPrompts}
									</span>
									<span className={styles["stat-label"]}>Total prompts</span>
								</div>
								<div className={styles["stat-tile"]}>
									<span className={styles["stat-value"]}>
										{averageScore}
									</span>
									<span className={styles["stat-label"]}>
										Average score
									</span>
								</div>
							</div>
						) : (
							<div className={styles["empty-state"]}>
								<p className={styles["empty-state-text"]}>No Prompts Yet</p>
								<p className={styles["empty-state-subtext"]}>
									Once you do, your totals and average score will show up
									here.
								</p>
								<Link
									className={styles["empty-state-cta"]}
									to={AppRoute.TRAINING}
								>
									Create one to get started
								</Link>
							</div>
						)}
					</section>
				</div>
			</div>
		</main>
	);
};

export { Profile };
