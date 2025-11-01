// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<main className="p-6 max-w-xl mx-auto text-center">
			<h1 className="text-2xl font-semibold mb-2">Page not found</h1>
			<p className="mb-6">The link may be broken or the page moved.</p>
			<div className="flex gap-3 justify-center">
				<Link className="underline" to="/dashboard">
					Go to Dashboard
				</Link>
				<Link className="underline" to="/login">
					Go to Login
				</Link>
			</div>
			{/* keep crawlers away from the app shell */}
			<meta name="robots" content="noindex,nofollow" />
		</main>
	);
}
