import { LoaderVariant } from "~/libs/components/loader/libs/enums/enums.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";
import { useGetProfileSummaryQuery } from "~/modules/users/users-api.js";

import styles from "./styles.module.css";

const NO_PROMPTS_COUNT = 0;

const Profile: React.FC = () => {
	const { data, isLoading } = useGetProfileSummaryQuery(undefined);

	if (isLoading) {
		return <Loader label="Loading profile" variant={LoaderVariant.SECTION} />;
	}

	if (!data) {
		return null;
	}

	const {
		averageScore,
		memberSince,
		nickname,
		primaryAiCodingTool,
		totalPrompts,
	} = data;
	const hasPrompts = totalPrompts > NO_PROMPTS_COUNT;
	const memberSinceLabel = new Date(memberSince).toLocaleDateString();

	return (
		<div className={getValidClasses("page-container", styles["page-wrapper"])}>
			<header className={styles["header"]}>
				<h2 className={styles["title"]}>Profile</h2>
			</header>

			<section className={styles["card"]}>
				<div className={styles["detail-row"]}>
					<span className={styles["detail-label"]}>Nickname</span>
					<span className={styles["detail-value"]}>{nickname}</span>
				</div>
				<div className={styles["detail-row"]}>
					<span className={styles["detail-label"]}>Primary AI coding tool</span>
					<span className={styles["detail-value"]}>
						{primaryAiCodingTool ?? "Not set yet"}
					</span>
				</div>
				<div className={styles["detail-row"]}>
					<span className={styles["detail-label"]}>Member since</span>
					<span className={styles["detail-value"]}>{memberSinceLabel}</span>
				</div>
			</section>

			<section className={styles["card"]}>
				<h3 className={styles["section-title"]}>Your prompt activity</h3>
				{hasPrompts ? (
					<div className={styles["stats-grid"]}>
						<div className={styles["stat-tile"]}>
							<span className={styles["stat-value"]}>{totalPrompts}</span>
							<span className={styles["stat-label"]}>Total prompts</span>
						</div>
						<div className={styles["stat-tile"]}>
							<span className={styles["stat-value"]}>{averageScore}</span>
							<span className={styles["stat-label"]}>Average score</span>
						</div>
					</div>
				) : (
					<div className={styles["empty-state"]}>
						<p className={styles["empty-state-text"]}>
							You haven&apos;t recorded any prompts yet.
						</p>
						<p className={styles["empty-state-subtext"]}>
							Once you do, your totals and average score will show up here.
						</p>
					</div>
				)}
			</section>
		</div>
	);
};

export { Profile };
