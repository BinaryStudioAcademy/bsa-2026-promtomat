import { type Knex } from "knex";

import { DatabaseTableName } from "../../libs/modules/database/database.js";

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(DatabaseTableName.WORKSPACES, (table) => {
		table
			.integer("user_id")
			.references("id")
			.inTable(DatabaseTableName.USERS)
			.nullable();
	});

	await knex.raw(
		"UPDATE workspaces SET user_id = memberships.user_id FROM memberships WHERE memberships.workspace_id = workspaces.id AND memberships.role = 'owner';",
	);

	await knex.schema.alterTable(DatabaseTableName.WORKSPACES, (table) => {
		table.integer("user_id").notNullable().alter();
	});

	await knex.raw("DELETE FROM memberships WHERE role = 'owner';");
}

async function up(knex: Knex): Promise<void> {
	await knex.raw(
		"INSERT INTO memberships (user_id, workspace_id, role) SELECT user_id, id, 'owner' FROM workspaces;",
	);

	await knex.schema.alterTable(DatabaseTableName.WORKSPACES, (table) => {
		table.dropColumn("user_id");
	});
}

export { down, up };
