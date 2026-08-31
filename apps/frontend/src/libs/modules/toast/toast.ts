import { toast as toastify } from "react-toastify";

type ToastOptions = {
	id: string;
};

const toast = {
	error: (message: string, { id }: ToastOptions): void => {
		if (toastify.isActive(id)) {
			return;
		}

		toastify(message, { toastId: id, type: "error" });
	},
};

export { toast };
