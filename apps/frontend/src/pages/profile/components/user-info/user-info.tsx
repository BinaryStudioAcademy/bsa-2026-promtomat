import React from "react";

import { type UserDto } from "~/modules/users/users.js";

import { formatDate } from "../../libs/helpers/helpers.js";
import styles from "./styles.module.css";

type Properties = {
	user: UserDto & { totalPrompts: number };
};

const UserInfo: React.FC<Properties> = ({ user }: Properties) => {
	const formattedCreatedAt = formatDate(user.createdAt);
	const userDetails = `Member since ${formattedCreatedAt} · ${String(user.totalPrompts)} prompts contributed`;
	return (
		<div className={styles["info"]}>
			<div className={styles["avatar-wrapper"]}></div>
			<div>
				<p className={styles["nickname"]}>{user.nickname}</p>
				<span className={styles["details"]}>{userDetails}</span>
			</div>
		</div>
	);
};

export { UserInfo };
