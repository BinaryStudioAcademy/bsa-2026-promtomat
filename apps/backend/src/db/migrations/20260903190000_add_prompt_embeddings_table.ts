import { type Knex } from "knex";

const TableName = {
	PROMPT_EMBEDDINGS: "prompt_embeddings",
	PROMPTS: "prompts",
} as const;

const DELETE_STRATEGY = "CASCADE";

const EMBEDDING_DIMENSION = 1024;

const ColumnName = {
	CREATED_AT: "created_at",
	EMBEDDING: "embedding",
	ID: "id",
	MODEL_ID: "model_id",
	PROMPT_ID: "prompt_id",
	SOURCE_HASH: "source_hash",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TableName.PROMPT_EMBEDDINGS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableName.PROMPT_EMBEDDINGS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.PROMPT_ID)
			.notNullable()
			.unique()
			.references(ColumnName.ID)
			.inTable(TableName.PROMPTS)
			.onDelete(DELETE_STRATEGY);
		table
			.specificType(
				ColumnName.EMBEDDING,
				`vector(${EMBEDDING_DIMENSION.toString()})`,
			)
			.notNullable();
		table.string(ColumnName.MODEL_ID).notNullable();
		table.string(ColumnName.SOURCE_HASH).notNullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

export { down, up };
