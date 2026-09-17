import { Fragment, useCallback, useId } from "react";

import { getValidClasses } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type WorkspaceListScope } from "~/modules/workspaces/workspaces.js";

import { WORKSPACE_LIST_SCOPE_OPTIONS } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	activeScope: ValueOf<typeof WorkspaceListScope>;
	onScopeChange: (scope: ValueOf<typeof WorkspaceListScope>) => void;
};

const WorkspaceListScopeFilter: React.FC<Properties> = ({
	activeScope,
	onScopeChange,
}: Properties) => {
	const groupName = useId();

	const handleScopeChange = useCallback(
		(scope: ValueOf<typeof WorkspaceListScope>) => {
			return (): void => {
				onScopeChange(scope);
			};
		},
		[onScopeChange],
	);

	return (
		<fieldset className={styles["group"]}>
			<legend className="visually-hidden">
				Filter workspaces by ownership
			</legend>

			{WORKSPACE_LIST_SCOPE_OPTIONS.map((option) => {
				const optionId = `${groupName}-${option.value}`;

				return (
					<Fragment key={option.value}>
						<input
							checked={activeScope === option.value}
							className={getValidClasses(styles["input"], "visually-hidden")}
							id={optionId}
							name={groupName}
							onChange={handleScopeChange(option.value)}
							type="radio"
							value={option.value}
						/>
						<label
							className={styles["label"]}
							data-label={option.label}
							htmlFor={optionId}
						>
							{option.label}
						</label>
					</Fragment>
				);
			})}
		</fieldset>
	);
};

export { WorkspaceListScopeFilter };
