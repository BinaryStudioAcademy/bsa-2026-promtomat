import { type Knex } from "knex";

const TABLE_NAME = "workspaces";
const DEFAULT_TARGET = 1000;
const MINIMAL_TARGET = 1;

const ColumnName = {
	DATASET_TARGET: "dataset_target",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.DATASET_TARGET);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table
			.smallint(ColumnName.DATASET_TARGET)
			.notNullable()
			.defaultTo(DEFAULT_TARGET);
		table.check(
			`"${ColumnName.DATASET_TARGET}" >= ${String(MINIMAL_TARGET)}`,
			[],
			"workspaces_dataset_target_check",
		);
	});
}

export { down, up };
