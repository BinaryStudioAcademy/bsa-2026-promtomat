import { useCallback, useEffect, useRef, useState } from "react";
import { type Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { WORKSPACE_ID_SEARCH_PARAMETER } from "~/libs/constants/constants.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/use-app-form/use-app-form.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";

import {
	useUpdatePromptBodyMutation,
	useUpdatePromptScoreMutation,
} from "../../../prompts-api.js";
import { PromptRevisionMessage } from "../../enums/enums.js";
import { type PromptForkDraft } from "../../types/prompt-fork-draft.type.js";
import {
	type PromptItemResponseDto,
	type PromptUpdateBodyRequestDto,
} from "../../types/types.js";
import { promptUpdateBodyValidationSchema } from "../../validation-schemas/validation-schemas.js";

type Parameters = {
	prompt: PromptItemResponseDto;
};

type ReturnValue = {
	bodyControl: Control<PromptUpdateBodyRequestDto, null>;
	handleCancelBodyEdit: () => void;
	handleFork: () => void;
	handleSaveBody: () => void;
	handleScoreSelect: (score: number) => () => void;
	handleStartBodyEdit: () => void;
	isEditingBody: boolean;
	isSavingBody: boolean;
	isSavingScore: boolean;
};

const usePromptRevision = ({ prompt }: Parameters): ReturnValue => {
	const navigate = useNavigate();
	const [updateBody, { isLoading: isSavingBody }] =
		useUpdatePromptBodyMutation();
	const [updateScore, { isLoading: isSavingScore }] =
		useUpdatePromptScoreMutation();
	const [isEditingBody, setIsEditingBody] = useState(false);
	const lastBodyReference = useRef(prompt.body);
	const { control, handleSubmit, reset } =
		useAppForm<PromptUpdateBodyRequestDto>({
			defaultValues: { promptBody: prompt.body },
			validationSchema: promptUpdateBodyValidationSchema,
		});

	useEffect(() => {
		lastBodyReference.current = prompt.body;
		reset({ promptBody: prompt.body });
		setIsEditingBody(false);
	}, [prompt.body, prompt.id, reset]);

	const handleStartBodyEdit = useCallback((): void => {
		setIsEditingBody(true);
	}, []);

	const handleCancelBodyEdit = useCallback((): void => {
		reset({ promptBody: lastBodyReference.current });
		setIsEditingBody(false);
	}, [reset]);

	const handleSaveBody = useCallback((): void => {
		void handleSubmit(async (payload: PromptUpdateBodyRequestDto) => {
			if (payload.promptBody === lastBodyReference.current) {
				setIsEditingBody(false);
				return;
			}

			const previousBody = lastBodyReference.current;

			try {
				await updateBody({ id: prompt.id, payload }).unwrap();
				lastBodyReference.current = payload.promptBody;
				setIsEditingBody(false);
				showNotification({
					message: PromptRevisionMessage.UPDATE_BODY_SUCCESS,
					type: NotificationType.SUCCESS,
				});
			} catch {
				lastBodyReference.current = previousBody;
				reset({ promptBody: previousBody });
			}
		})();
	}, [handleSubmit, prompt.id, reset, updateBody]);

	const handleScoreSelect = useCallback(
		(score: number) => {
			return (): void => {
				if (isSavingScore) {
					return;
				}

				const efficiencyScore = prompt.score === score ? null : score;

				void updateScore({
					id: prompt.id,
					payload: { efficiencyScore },
				})
					.unwrap()
					.then(() => {
						showNotification({
							message: PromptRevisionMessage.UPDATE_SCORE_SUCCESS,
							type: NotificationType.SUCCESS,
						});
					})
					.catch(() => {
						// The score control keeps the last persisted value.
					});
			};
		},
		[isSavingScore, prompt.id, prompt.score, updateScore],
	);

	const handleFork = useCallback((): void => {
		const searchParameters = new URLSearchParams({
			[WORKSPACE_ID_SEARCH_PARAMETER]: String(prompt.workspaceId),
		});
		const draft: PromptForkDraft = {
			promptBody: prompt.body,
			taskIntent: prompt.intent,
		};

		void navigate(
			{
				pathname: AppRoute.TRAINING,
				search: searchParameters.toString(),
			},
			{ state: draft },
		);
	}, [navigate, prompt.body, prompt.intent, prompt.workspaceId]);

	return {
		bodyControl: control,
		handleCancelBodyEdit,
		handleFork,
		handleSaveBody,
		handleScoreSelect,
		handleStartBodyEdit,
		isEditingBody,
		isSavingBody,
		isSavingScore,
	};
};

export { usePromptRevision };
