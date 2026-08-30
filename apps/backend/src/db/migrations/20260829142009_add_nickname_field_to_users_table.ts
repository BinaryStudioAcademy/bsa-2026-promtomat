import { type Knex } from "knex";
/*
Safe migration which added a "nickname" field to a "users" table
"nickname" field is required, so we need to migrate in a few steps:
The first step is adding a new column that is not required;
The second step is setting up a "nickname" column with values generated from
user id in order not to get db errors;
The third step is making the "nickname" column required to
correspond task requirements;
*/
const TABLE_NAME = "users";
const ColumnProperties = {
	COLUMN_NAME: "nickname",
	MAX_LENGTH: 25,
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnProperties.COLUMN_NAME);
	});
}

async function up(knex: Knex): Promise<void> {
	// Adding a "username" column with max length 25 to the "users" table,
	// which is not required yet
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table
			.string(ColumnProperties.COLUMN_NAME, ColumnProperties.MAX_LENGTH)
			.nullable();
	});

	// Setting up empty nicknames with values
	// Nickname generation with the prefix "user _" + id value
	// Example "user_test@gmail.com"
	await knex(TABLE_NAME)
		.whereNull(ColumnProperties.COLUMN_NAME)
		.update({
			[ColumnProperties.COLUMN_NAME]: knex.raw("CONCAT('user_', id)"),
		});

	// Update "nickname" column to be required for now
	// Made it unique and not nullable to correspond task requirements
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.string(ColumnProperties.COLUMN_NAME).notNullable().unique().alter();
	});
}

export { down, up };
