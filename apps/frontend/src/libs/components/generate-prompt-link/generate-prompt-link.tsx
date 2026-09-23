import { useCallback } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "~/libs/components/icon/icon.js";
import { AppRoute, IconName } from "~/libs/enums/enums.js";
import { getValidClasses } from "~/libs/helpers/helpers.js";

import { GeneratePromptLinkLabel } from "./libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
};

const GeneratePromptLink: React.FC<Properties> = ({
	className,
}: Properties) => {
	const getLinkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			getValidClasses(
				styles["generate"],
				isActive && styles["active"],
				className,
			),
		[className],
	);

	return (
		<NavLink className={getLinkClassName} to={AppRoute.GENERATE}>
			<Icon iconName={IconName.SPARKLES} />
			{GeneratePromptLinkLabel.GENERATE_PROMPT}
		</NavLink>
	);
};

export { GeneratePromptLink };
