import { type Knex } from "knex";

const EXTENSION_NAME = "vector";

function down(): Promise<void> {
	return Promise.resolve();
}

async function up(knex: Knex): Promise<void> {
	await knex.raw("CREATE EXTENSION IF NOT EXISTS ??", [EXTENSION_NAME]);
}

export { down, up };
