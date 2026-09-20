import { type Control } from "react-hook-form";

import { Button } from "~/libs/components/button/button.js";
import { Input } from "~/libs/components/input/input.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { ApiTokenRequestDto } from "~/modules/api-tokens/api-tokens.js";

import { ApiTokensMessage } from "../../libs/enums/enums.js";
import styles from "../../styles.module.css";

type Properties = {
	control: Control<ApiTokenRequestDto, null>;
	isCreating: boolean;
	onSubmit: (event: React.BaseSyntheticEvent) => void;
};

const CreateTokenForm = ({ control, isCreating, onSubmit }: Properties) => {
	return (
		<form className={styles["form"]} onSubmit={onSubmit}>
			<div className={styles["form-field"]}>
				<Input
					control={control}
					label={ApiTokensMessage.NAME_LABEL}
					name="name"
					placeholder={ApiTokensMessage.NAME_PLACEHOLDER}
				/>
			</div>
			<Button
				isDisabled={isCreating}
				label={ApiTokensMessage.CREATE}
				size={ControlSize.MD}
				type="submit"
				variant={ButtonVariant.PRIMARY}
			/>
		</form>
	);
};

export { CreateTokenForm };
