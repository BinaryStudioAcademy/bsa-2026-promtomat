import React from "react";

import { DateFormat } from "~/libs/enums/enums.js";
import { formatDate, getNicknameInitials } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	memberSince: string;
	nickname: string;
	totalPrompts: number;
};

const UserInfo: React.FC<Properties> = ({
	memberSince,
	nickname,
	totalPrompts,
}: Properties) => {
	const formattedCreatedAt = formatDate(memberSince, DateFormat.MON_DAY_YEAR);
	const userDetails = `Member since ${formattedCreatedAt} · ${String(totalPrompts)} prompts contributed`;
	return (
		<div className={styles["info"]}>
			<div className={styles["avatar-wrapper"]}>
				{getNicknameInitials(nickname)}
			</div>
			<div>
				<p className={styles["nickname"]}>{nickname}</p>
				<span className={styles["details"]}>{userDetails}</span>
			</div>
		</div>
	);
};

export { UserInfo };
