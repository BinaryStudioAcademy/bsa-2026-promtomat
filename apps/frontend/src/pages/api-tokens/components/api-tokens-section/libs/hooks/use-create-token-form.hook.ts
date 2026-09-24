import { useCallback } from "react";

import { ApiTokenExpiration } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import {
	apiTokenCreateValidationSchema,
	ApiTokenRequestDto,
} from "~/modules/api-tokens/api-tokens.js";

const DEFAULT_VALUES: ApiTokenRequestDto = {
	expiration: ApiTokenExpiration.NEVER,
	name: "",
};

const useCreateTokenForm = () => {
	const { control, handleSubmit, reset } = useAppForm<ApiTokenRequestDto>({
		defaultValues: DEFAULT_VALUES,
		validationSchema: apiTokenCreateValidationSchema,
	});

	const handleCreateSubmit = (create: (payload: ApiTokenRequestDto) => void) =>
		useCallback((event: React.BaseSyntheticEvent): void => {
			void handleSubmit(create)(event);
		}, []);

	const resetValuesToDefault = useCallback(() => {
		reset(DEFAULT_VALUES);
	}, []);

	return {
		control,
		handleCreateSubmit,
		resetValuesToDefault,
	};
};

export { useCreateTokenForm };
