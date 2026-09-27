const STREAK_RECOMPUTE_QUERY = `
	WITH active_days AS (
		SELECT (created_at AT TIME ZONE :timeZone)::date AS day
		FROM prompts
		WHERE user_id = :userId
		GROUP BY 1
	), runs AS (
		SELECT day, day - (row_number() OVER (ORDER BY day))::int AS run_id
		FROM active_days
	), latest_run AS (
		SELECT count(*) AS length, max(day) AS last_day
		FROM runs
		GROUP BY run_id
		ORDER BY last_day DESC
		LIMIT 1
	)
	UPDATE users
	SET
		time_zone = :timeZone,
		current_streak = COALESCE(
			(
				SELECT CASE
					WHEN last_day >= (now() AT TIME ZONE :timeZone)::date - 1
						THEN length
					ELSE 0
				END
				FROM latest_run
			),
			0
		),
		last_prompt_date = (SELECT last_day FROM latest_run)
	WHERE id = :userId
	RETURNING current_streak AS "currentStreak"
`;

export { STREAK_RECOMPUTE_QUERY };
