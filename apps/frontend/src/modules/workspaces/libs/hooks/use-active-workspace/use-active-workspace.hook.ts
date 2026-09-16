import { useCallback, useEffect, useState } from "react";

import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

import {
	parseStoredWorkspaceId,
	resolveActiveWorkspaceId,
} from "../../helpers/helpers.js";
import { type WorkspaceListItemDto } from "../../types/types.js";

type Parameters = {
	formWorkspaceId: number | undefined;
	workspaces: undefined | WorkspaceListItemDto[];
};

const useActiveWorkspace = ({
	formWorkspaceId,
	workspaces,
}: Parameters): number | undefined => {
	const [storedWorkspaceId, setStoredWorkspaceId] = useState<
		null | number | undefined
	>();

	const persistActiveWorkspaceId = useCallback((workspaceId: number): void => {
		setStoredWorkspaceId(workspaceId);
		void storage.set(StorageKey.ACTIVE_WORKSPACE_ID, String(workspaceId));
	}, []);

	useEffect(() => {
		const loadStoredWorkspaceId = async (): Promise<void> => {
			const storedValue = await storage.get(StorageKey.ACTIVE_WORKSPACE_ID);

			setStoredWorkspaceId(parseStoredWorkspaceId(storedValue));
		};

		void loadStoredWorkspaceId();
	}, []);

	const activeWorkspaceId = resolveActiveWorkspaceId({
		formWorkspaceId,
		storedWorkspaceId,
		workspaces,
	});

	useEffect(() => {
		if (
			activeWorkspaceId === undefined ||
			storedWorkspaceId === activeWorkspaceId
		) {
			return;
		}

		persistActiveWorkspaceId(activeWorkspaceId);
	}, [activeWorkspaceId, persistActiveWorkspaceId, storedWorkspaceId]);

	return activeWorkspaceId;
};

export { useActiveWorkspace };
