import { useCallback, useState } from "react";

const COPY_TIMEOUT_MS = 2000;

type UseClipboardReturn = {
	copyToClipboard: (text: string) => Promise<void>;
	isCopied: boolean;
};

const useClipboard = (): UseClipboardReturn => {
	const [isCopied, setIsCopied] = useState<boolean>(false);

	const copyToClipboard = useCallback(async (text: string): Promise<void> => {
		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);

			setTimeout(() => {
				setIsCopied(false);
			}, COPY_TIMEOUT_MS);
		} catch {
			setIsCopied(false);
		}
	}, []);

	return { copyToClipboard, isCopied };
};

export { useClipboard };
