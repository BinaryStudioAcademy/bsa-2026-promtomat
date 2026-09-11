import React, { useId } from "react";
import { useWatch } from "react-hook-form";

import { Input } from "~/libs/components/input/input.js";
import { LoaderVariant } from "~/libs/components/loader/libs/enums/loader-variant.enum.js";
import { Loader } from "~/libs/components/loader/loader.js";
import { Select } from "~/libs/components/select/select.js";
import { ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { useSearch } from "~/libs/hooks/use-search/use-search.hook.js";
import { useSearchPromptsQuery } from "~/modules/prompts/prompts-api.js";
import { useGetWorkspacesQuery } from "~/modules/workspaces/workspaces-api.js";

import { SearchResultsPanel } from "./components/search-results-panel/search-results-panel.js";
import styles from "./styles.module.css";

const SEARCH_DELAY_MS = 150;
const SEARCH_DESCRIPTION_MIN_LENGTH = 3;

type WorkspaceScopeFormValues = {
	workspaceId: number;
};

const SmartSearch: React.FC = () => {
	const searchScopeLabelId = useId();

	const { data: workspacesData } = useGetWorkspacesQuery({});
	const workspaces = workspacesData?.items;

	const options = workspaces?.map(({ id, name }) => ({
		label: name,
		value: id,
	}));

	const { control: workspaceControl } = useAppForm<WorkspaceScopeFormValues>({
		defaultValues: {},
	});
	const workspaceId = useWatch({
		control: workspaceControl,
		name: "workspaceId",
	});

	const { control: searchControl, debouncedSearch } =
		useSearch(SEARCH_DELAY_MS);

	const {
		data: searchData,
		error,
		isFetching,
	} = useSearchPromptsQuery(
		{ description: debouncedSearch, workspaceId },
		{
			skip:
				!workspaceId || debouncedSearch.length <= SEARCH_DESCRIPTION_MIN_LENGTH,
		},
	);

	return (
		<div className={styles["content-column"]}>
			<div className={styles["search-scope-row"]}>
				<span className={styles["search-scope-label"]} id={searchScopeLabelId}>
					Search in:
				</span>
				<div className={styles["workspace-select"]}>
					<Select
						control={workspaceControl}
						descriptionId={searchScopeLabelId}
						isLabelHidden
						label="Search in"
						name="workspaceId"
						options={options ?? []}
						placeholder="Select workspace..."
						size={ControlSize.LG}
					/>
				</div>
			</div>
			<div className={styles["search-zone"]}>
				<Input
					control={searchControl}
					isDisabled={!workspaceId}
					isLabelHidden
					label="Prompt search field"
					name="search"
					placeholder="Describe your coding task... (e.g., Implement middleware session validation)"
					size={ControlSize.LG}
				/>
				{isFetching && <Loader variant={LoaderVariant.SECTION} />}
				{error !== undefined && <span>Something went wrong. Try again.</span>}
				{searchData && <SearchResultsPanel items={searchData.items} />}
			</div>
		</div>
	);
};

export { SmartSearch };
