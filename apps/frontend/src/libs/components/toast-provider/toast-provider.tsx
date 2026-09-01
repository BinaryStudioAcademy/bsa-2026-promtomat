import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const AUTO_CLOSE_MS = 5000;

const ToastProvider: React.FC = () => (
	<ToastContainer
		autoClose={AUTO_CLOSE_MS}
		closeOnClick
		pauseOnFocusLoss
		role="status"
		theme="dark"
	/>
);

export { ToastProvider };
