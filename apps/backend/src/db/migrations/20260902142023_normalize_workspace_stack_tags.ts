import { type Knex } from "knex";

import { normalizeWorkspaceTags } from "~/libs/helpers/helpers.js";
import { logger } from "~/libs/modules/logger/logger.js";

const TABLE_NAME = "workspaces";

const ColumnName = {
	ID: "id",
	STACK_TAGS: "stack_tags",
	UPDATED_AT: "updated_at",
} as const;

type WorkspaceRow = {
	[ColumnName.ID]: number;
	[ColumnName.STACK_TAGS]: null | string[];
	[ColumnName.UPDATED_AT]: string;
};

function down(): Promise<void> {
	logger.warn(
		`Rollback aborted: The data migration on "${TABLE_NAME}" cannot be programmatically reversed. ` +
			"To restore original free-text tags, inspect the 'CRITICAL IRREVERSIBLE DATA CHANGE' logs " +
			"generated during the 'up' migration execution and restore affected rows manually.",
	);
	return Promise.resolve();
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		const workspaces: WorkspaceRow[] = await trx(TABLE_NAME).select(
			ColumnName.ID,
			ColumnName.STACK_TAGS,
		);

		for (const workspace of workspaces) {
			const originalTags = workspace[ColumnName.STACK_TAGS];

			if (!Array.isArray(originalTags)) {
				continue;
			}

			const { droppedTags, normalizedTags } =
				normalizeWorkspaceTags(originalTags);

			const isChanged =
				JSON.stringify(workspace[ColumnName.STACK_TAGS]) !==
				JSON.stringify(normalizedTags);

			if (!isChanged) {
				continue;
			}

			logger.warn(
				`CRITICAL IRREVERSIBLE DATA CHANGE: Workspace ID ${String(workspace[ColumnName.ID])} tags updated. ` +
					`Original: [${originalTags.join(", ")}], ` +
					`Normalized: [${normalizedTags.join(", ")}]. ` +
					`Dropped entries: [${droppedTags.join(", ")}].`,
			);

			await trx(TABLE_NAME)
				.where(ColumnName.ID, workspace[ColumnName.ID])
				.update({
					[ColumnName.STACK_TAGS]: normalizedTags,
					[ColumnName.UPDATED_AT]: trx.fn.now(),
				});
		}
	});
}

export { down, up };
