import { type Ref } from "react";

import { IconButton } from "~/libs/components/icon-button/icon-button.js";
import { ControlSize, IconName } from "~/libs/enums/enums.js";
import { type UserDto } from "~/modules/users/users.js";

import { AccountMenu } from "./components/account-menu/account-menu.js";
import { HeaderLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	isNavigationOpen: boolean;
	navigationId: string;
	navigationToggleReference: Ref<HTMLButtonElement>;
	onNavigationToggle: () => void;
	subtitle: string;
	title: string;
	user: UserDto;
};

const Header: React.FC<Properties> = ({
	isNavigationOpen,
	navigationId,
	navigationToggleReference,
	onNavigationToggle,
	subtitle,
	title,
	user,
}: Properties) => {
	return (
		<header className={styles["header"]}>
			<div className={styles["menu-toggle"]}>
				<IconButton
					ariaControls={navigationId}
					ariaExpanded={isNavigationOpen}
					ariaLabel={HeaderLabel.TOGGLE_NAVIGATION}
					className={styles["navigation-toggle"]}
					iconName={IconName.MENU}
					onClick={onNavigationToggle}
					reference={navigationToggleReference}
					size={ControlSize.LG}
				/>
			</div>

			<div className={styles["copy"]}>
				<h1 className={styles["title"]}>{title}</h1>
				<p className={styles["subtitle"]}>{subtitle}</p>
			</div>

			<div className={styles["actions"]}>
				<AccountMenu isNavigationOpen={isNavigationOpen} user={user} />
			</div>
		</header>
	);
};

export { Header };
