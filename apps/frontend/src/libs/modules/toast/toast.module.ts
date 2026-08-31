import { toast } from "react-toastify";

class Toast {
	error(message: string, id: string) {
		if (toast.isActive(id)) {
			return;
		}

		toast(message, { toastId: id, type: "error" });
	}

	info(message: string, id: string) {
		if (toast.isActive(id)) {
			return;
		}

		toast(message, { toastId: id, type: "info" });
	}

	warn(message: string, id: string) {
		if (toast.isActive(id)) {
			return;
		}

		toast(message, { toastId: id, type: "warning" });
	}
}

export { Toast };
