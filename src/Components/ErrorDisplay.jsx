import { useError } from "../ErrorContext";

const ErrorDisplay = () => {
	const { errors, dismissError } = useError();

	return (
		<div className="fixed bottom-4 right-4 space-y-2 z-50">
			{errors.map((err) => (
				<div
					key={err.id}
					className="bg-red-600 text-white p-3 rounded-lg shadow-lg flex justify-between items-center min-w-[250px]"
				>
					<span>{err.msg}</span>
					<button
						onClick={() => dismissError(err.id)}
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
