const STREAK_READ_QUERY = `
	SELECT
		CASE
			WHEN last_prompt_date >= (now() AT TIME ZONE time_zone)::date - 1
				THEN current_streak
			ELSE 0
		END AS "currentStreak",
		time_zone AS "timeZone"
	FROM users
	WHERE id = ?
`;

export { STREAK_READ_QUERY };
