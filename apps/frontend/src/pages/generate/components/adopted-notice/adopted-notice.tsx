import React, { useEffect, useRef } from "react";

import { ButtonLink } from "~/libs/components/button-link/button-link.js";
import { Icon } from "~/libs/components/icon/icon.js";
import { ButtonVariant, ControlSize, IconName } from "~/libs/enums/enums.js";
import {
	getPromptRoute,
	getScoreLabel,
	type PromptDto,
} from "~/modules/prompts/prompts.js";

import { GenerateLabel } from "../../libs/enums/enums.js";
import styles from "./styles.module.css";

type Properties = {
	prompt: PromptDto;
};

const AdoptedNotice: React.FC<Properties> = ({ prompt }: Properties) => {
	const lineReference = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		lineReference.current?.focus();
	}, []);

	return (
		<div className={styles["notice"]}>
			<p
				className={styles["line"]}
				ref={lineReference}
				role="status"
				tabIndex={-1}
			>
				<Icon className={styles["icon"]} iconName={IconName.CHECK_CIRCLE} />
				<span>{`${GenerateLabel.SAVED_TO_LOG} · ${getScoreLabel(prompt.efficiencyScore)}`}</span>
			</p>
			<ButtonLink
				label={GenerateLabel.OPEN_IN_LOG}
				shouldOpenInNewTab
				size={ControlSize.SM}
				to={getPromptRoute(prompt.id)}
				variant={ButtonVariant.SECONDARY}
			/>
		</div>
	);
};

export { AdoptedNotice };
