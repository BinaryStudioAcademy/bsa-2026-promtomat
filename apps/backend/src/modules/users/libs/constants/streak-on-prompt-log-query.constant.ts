const STREAK_ON_PROMPT_LOG_QUERY = `
	UPDATE users
	SET
		current_streak = CASE
			WHEN last_prompt_date = (now() AT TIME ZONE time_zone)::date
				THEN current_streak
			WHEN last_prompt_date = (now() AT TIME ZONE time_zone)::date - 1
				THEN current_streak + 1
			ELSE 1
		END,
		last_prompt_date = (now() AT TIME ZONE time_zone)::date
	WHERE id = ?
`;

export { STREAK_ON_PROMPT_LOG_QUERY };
