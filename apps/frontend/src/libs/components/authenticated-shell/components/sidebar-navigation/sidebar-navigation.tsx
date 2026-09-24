import { SHELL_NAVIGATION_ITEMS } from "../../libs/constants/constants.js";
import { SidebarNavigationItem } from "./sidebar-navigation-item.js";
import styles from "./styles.module.css";

const SidebarNavigation: React.FC = () => {
	return (
		<nav aria-label="Sidebar" className={styles["nav"]}>
			<ul className={styles["list"]}>
				{SHELL_NAVIGATION_ITEMS.map((item) => (
					<li key={item.to}>
						<SidebarNavigationItem
							iconName={item.iconName}
							label={item.label}
							to={item.to}
						/>
					</li>
				))}
			</ul>
		</nav>
	);
};

export { SidebarNavigation };
