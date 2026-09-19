import { useCallback, useEffect, useState } from "react";

import { storage, StorageKey } from "~/libs/modules/storage/storage.js";

import { StoredWorkspaceStatus } from "../../enums/enums.js";
import {
	parseStoredWorkspaceId,
	resolveActiveWorkspaceId,
} from "../../helpers/helpers.js";
import {
	type StoredWorkspaceState,
	type WorkspaceListItemDto,
} from "../../types/types.js";

type Parameters = {
	formWorkspaceId: number | undefined;
	workspaces: undefined | WorkspaceListItemDto[];
};

const useActiveWorkspace = ({
	formWorkspaceId,
	workspaces,
}: Parameters): number | undefined => {
	const [storedWorkspaceState, setStoredWorkspaceState] =
		useState<StoredWorkspaceState>({ status: StoredWorkspaceStatus.LOADING });

	const persistActiveWorkspaceId = useCallback((workspaceId: number): void => {
		setStoredWorkspaceState({
			status: StoredWorkspaceStatus.RESOLVED,
			workspaceId,
		});
		void storage.set(StorageKey.ACTIVE_WORKSPACE_ID, String(workspaceId));
	}, []);

	useEffect(() => {
		const loadStoredWorkspaceId = async (): Promise<void> => {
			const storedValue = await storage.get(StorageKey.ACTIVE_WORKSPACE_ID);

			setStoredWorkspaceState({
				status: StoredWorkspaceStatus.RESOLVED,
				workspaceId: parseStoredWorkspaceId(storedValue),
			});
		};

		void loadStoredWorkspaceId();
	}, []);

	const activeWorkspaceId = resolveActiveWorkspaceId({
		formWorkspaceId,
		storedWorkspaceState,
		workspaces,
	});

	useEffect(() => {
		if (
			activeWorkspaceId === undefined ||
			(storedWorkspaceState.status === StoredWorkspaceStatus.RESOLVED &&
				storedWorkspaceState.workspaceId === activeWorkspaceId)
		) {
			return;
		}

		persistActiveWorkspaceId(activeWorkspaceId);
	}, [activeWorkspaceId, persistActiveWorkspaceId, storedWorkspaceState]);

	return activeWorkspaceId;
};

export { useActiveWorkspace };
