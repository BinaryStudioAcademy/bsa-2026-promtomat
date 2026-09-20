import React from "react";

import { Button } from "~/libs/components/button/button.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";

import { SettingsMessage } from "../../libs/enums/enums.js";
import { Section } from "../section/section.js";
import styles from "./styles.module.css";

const Security: React.FC = () => {
	return (
		<Section title="SECURITY">
			<div className={styles["security-row"]}>
				<Button
					label={SettingsMessage.RESET_PASSWORD}
					size={ControlSize.MD}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			</div>
		</Section>
	);
};

export { Security };
