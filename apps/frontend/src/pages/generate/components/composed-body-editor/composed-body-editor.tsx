import React, { useCallback, useEffect, useRef } from "react";

import { Button } from "~/libs/components/button/button.js";
import { Textarea } from "~/libs/components/textarea/textarea.js";
import { ButtonVariant, ControlSize } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";

import {
	BODY_EDITOR_MAX_HEIGHT,
	BODY_EDITOR_ROWS,
} from "../../libs/constants/constants.js";
import { GenerateLabel } from "../../libs/enums/enums.js";
import { type ComposedBodyEditDto } from "../../libs/types/types.js";
import { composedBodyEditValidationSchema } from "../../libs/validation-schemas/validation-schemas.js";
import styles from "./styles.module.css";

type Properties = {
	body: string;
	onApply: (body: string) => void;
	onCancel: () => void;
};

const ComposedBodyEditor: React.FC<Properties> = ({
	body,
	onApply,
	onCancel,
}: Properties) => {
	const formReference = useRef<HTMLFormElement>(null);
	const { control, handleSubmit } = useAppForm<ComposedBodyEditDto>({
		defaultValues: { promptBody: body },
		validationSchema: composedBodyEditValidationSchema,
	});

	useEffect(() => {
		formReference.current?.focus();
	}, []);

	const handleFormSubmit = useCallback(
		(event: React.BaseSyntheticEvent): void => {
			void handleSubmit(({ promptBody }: ComposedBodyEditDto): void => {
				onApply(promptBody);
			})(event);
		},
		[handleSubmit, onApply],
	);

	return (
		<form
			className={styles["editor"]}
			noValidate
			onSubmit={handleFormSubmit}
			ref={formReference}
			tabIndex={-1}
		>
			<Textarea
				autoComplete="off"
				control={control}
				label={GenerateLabel.BODY_FIELD}
				maxHeight={BODY_EDITOR_MAX_HEIGHT}
				name="promptBody"
				rows={BODY_EDITOR_ROWS}
			/>
			<div className={styles["actions"]}>
				<Button
					label={GenerateLabel.APPLY}
					size={ControlSize.SM}
					type="submit"
					variant={ButtonVariant.PRIMARY}
				/>
				<Button
					label={GenerateLabel.CANCEL}
					onClick={onCancel}
					size={ControlSize.SM}
					type="button"
					variant={ButtonVariant.SECONDARY}
				/>
			</div>
		</form>
	);
};

export { ComposedBodyEditor };
