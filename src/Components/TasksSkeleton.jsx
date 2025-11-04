// TasksSkeleton.jsx
// Simple placeholder layout for the Dashboard “Your Tasks” section
// Displays 1–3 shimmer blocks depending on screen width

export default function TasksSkeleton({ heightClass = "h-24" }) {
	return (
		// "widget" keeps it visually consistent with your other dashboard panels
		// aria attributes improve accessibility (screen readers know it's a loading region)
		<div className="widget" role="status" aria-busy="true" aria-live="polite">
			{/* Flex layout: horizontal row of shimmer cards with spacing between them */}
			<div className="flex gap-4">
				{/* Render 3 placeholder blocks (1 visible on small, 2 on md, 3 on xl) */}
				{[1, 2, 3].map((n) => (
					<div
						key={n}
						className={`relative flex-1 rounded-xl overflow-hidden skel-block ${heightClass}
              ${
								// Responsive visibility:
								// Show 1 card on mobile, 2 on medium, 3 on extra-large screens
								n > 1 ? (n === 2 ? "hidden md:block" : "hidden xl:block") : ""
							}`}
						aria-hidden="true" // purely decorative, not read by assistive tech
					>
						{/* Actual shimmering overlay */}
						<div className="shimmer" />
					</div>
				))}
			</div>
		</div>
	);
}
