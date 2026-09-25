import { useCallback } from "react";

import { NotificationType } from "~/libs/components/overlay-host/libs/enums/enums.js";
import { useClipboard } from "~/libs/hooks/use-clipboard/use-clipboard.hook.js";
import { showNotification } from "~/libs/modules/notification/notification.js";

import { CopyPromptMessage } from "./libs/enums/enums.js";

type Parameters = {
	body: string;
	onCopied?: () => void;
};

const useCopyPrompt = ({ body, onCopied }: Parameters): (() => void) => {
	const { copyToClipboard } = useClipboard();

	return useCallback((): void => {
		void copyToClipboard(body).then((isCopied) => {
			showNotification({
				message: isCopied
					? CopyPromptMessage.SUCCESS
					: CopyPromptMessage.FAILURE,
				type: isCopied ? NotificationType.SUCCESS : NotificationType.DANGER,
			});

			if (isCopied) {
				onCopied?.();
			}
		});
	}, [body, copyToClipboard, onCopied]);
};

export { useCopyPrompt };
