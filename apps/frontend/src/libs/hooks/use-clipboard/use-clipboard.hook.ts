import { useCallback, useEffect, useRef, useState } from "react";

const COPY_TIMEOUT_MS = 2000;

type UseClipboardReturn = {
	copyToClipboard: (text: string) => Promise<boolean>;
	isCopied: boolean;
};

const useClipboard = (): UseClipboardReturn => {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const resetTimeoutReference = useRef<null | ReturnType<typeof setTimeout>>(
		null,
	);

	const clearResetTimeout = useCallback((): void => {
		if (!resetTimeoutReference.current) {
			return;
		}

		clearTimeout(resetTimeoutReference.current);
		resetTimeoutReference.current = null;
	}, []);

	useEffect(() => clearResetTimeout, [clearResetTimeout]);

	const copyToClipboard = useCallback(
		async (text: string): Promise<boolean> => {
			try {
				await navigator.clipboard.writeText(text);
				setIsCopied(true);
				clearResetTimeout();

				resetTimeoutReference.current = setTimeout(() => {
					setIsCopied(false);
				}, COPY_TIMEOUT_MS);

				return true;
			} catch {
				setIsCopied(false);

				return false;
			}
		},
		[clearResetTimeout],
	);

	return { copyToClipboard, isCopied };
};

export { useClipboard };
