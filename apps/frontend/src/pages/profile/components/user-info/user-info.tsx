import React from "react";

import { DateFormat } from "~/libs/enums/enums.js";
import { formatDate, getNicknameInitials } from "~/libs/helpers/helpers.js";
import { type UserDto } from "~/modules/users/users.js";

import styles from "./styles.module.css";

type Properties = {
	user: UserDto & { totalPrompts: number };
};

const UserInfo: React.FC<Properties> = ({ user }: Properties) => {
	const formattedCreatedAt = formatDate(
		user.createdAt,
		DateFormat.MON_DAY_YEAR,
	);
	const userDetails = `Member since ${formattedCreatedAt} · ${String(user.totalPrompts)} prompts contributed`;
	return (
		<div className={styles["info"]}>
			<div className={styles["avatar-wrapper"]}>
				{getNicknameInitials(user.nickname)}
			</div>
			<div>
				<p className={styles["nickname"]}>{user.nickname}</p>
				<span className={styles["details"]}>{userDetails}</span>
			</div>
		</div>
	);
};

export { UserInfo };
