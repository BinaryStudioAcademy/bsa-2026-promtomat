import "./notification.css";

type Properties = {
	message: string;
};

const Notification = ({ message }: Properties) => {
	return (
		<p
			aria-atomic="true"
			aria-live="polite"
			className="notification"
			role="status"
		>
			{message}
		</p>
	);
};

export { Notification };
