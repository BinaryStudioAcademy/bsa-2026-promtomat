import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	CURRENT_STREAK: "current_streak",
	LAST_PROMPT_DATE: "last_prompt_date",
	TIME_ZONE: "time_zone",
} as const;

const DEFAULT_TIME_ZONE = "UTC";
const DEFAULT_STREAK = 0;
const TIME_ZONE_MAX_LENGTH = 64;

const BACKFILL_QUERY = `
	WITH active_days AS (
		SELECT user_id, (created_at AT TIME ZONE ?)::date AS day
		FROM prompts
		GROUP BY user_id, 2
	), runs AS (
		SELECT
			user_id,
			day,
			day - (row_number() OVER (PARTITION BY user_id ORDER BY day))::int AS run_id
		FROM active_days
	), runs_aggregated AS (
		SELECT user_id, run_id, count(*) AS length, max(day) AS last_day
		FROM runs
		GROUP BY user_id, run_id
	), latest_run AS (
		SELECT DISTINCT ON (user_id) user_id, length, last_day
		FROM runs_aggregated
		ORDER BY user_id, last_day DESC
	)
	UPDATE users
	SET
		current_streak = CASE
			WHEN latest_run.last_day >= (now() AT TIME ZONE ?)::date - 1
			THEN latest_run.length
			ELSE 0
		END,
		last_prompt_date = latest_run.last_day
	FROM latest_run
	WHERE users.id = latest_run.user_id
`;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.CURRENT_STREAK);
		table.dropColumn(ColumnName.LAST_PROMPT_DATE);
		table.dropColumn(ColumnName.TIME_ZONE);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table
			.integer(ColumnName.CURRENT_STREAK)
			.notNullable()
			.defaultTo(DEFAULT_STREAK);
		table.date(ColumnName.LAST_PROMPT_DATE).nullable();
		table
			.string(ColumnName.TIME_ZONE, TIME_ZONE_MAX_LENGTH)
			.notNullable()
			.defaultTo(DEFAULT_TIME_ZONE);
	});

	await knex.raw(BACKFILL_QUERY, [DEFAULT_TIME_ZONE, DEFAULT_TIME_ZONE]);
}

export { down, up };
