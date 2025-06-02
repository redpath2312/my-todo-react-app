import { useAlert } from "../ErrorContext";

const ErrorDisplay = () => {
	const bgColor = {
		error: "bg-red-500",
		warn: "bg-yellow-500",
		info: "bg-blue-500",
	};
	const context = useAlert();
	console.log("ErrorContext:", context); // 👀 This is key

	const { alerts, clearAlert } = context;
	console.log("ErrorContext in ErrorDisplay:", context);

	return (
		<div className="fixed bottom-4 right-4 space-y-2 z-50">
			{alerts.map((err) => (
				<div
					key={err.id}
					className={`${
						bgColor[err.type] || bgColor.error
					} text-white p-3 rounded-lg shadow-lg flex justify-between items-center min-w-[250px]`}
				>
					<span>{err.msg}</span>
					<button
						onClick={() => clearAlert(err.id)}
						className="ml-3 text-white font-bold"
					>
						{" "}
						x
					</button>
				</div>
			))}
		</div>
	);
};

export default ErrorDisplay;
