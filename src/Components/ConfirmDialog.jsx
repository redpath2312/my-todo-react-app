import { useEffect, useRef } from "react";

export default function ConfirmDialog({
	open,
	title = "Are you sure?",
	description = "",
	confirmText = "Confirm",
	cancelText = "Cancel",
	tone = "default", // "danger" | "default"
	onConfirm,
	onCancel,
}) {
	const cancelRef = useRef(null);
	const previouslyFocused = useRef(null);

	useEffect(() => {
		if (!open) return;

		// remember who was focused to restore later
		previouslyFocused.current = document.activeElement;

		const onKey = (e) => {
			if (e.key === "Escape") onCancel?.();
		};

		window.addEventListener("keydown", onKey);
		// focus cancel for safe default
		requestAnimationFrame(() => cancelRef.current?.focus());
		return () => {
			window.removeEventListener("keydown", onKey);
			// restore focus to the opener
			previouslyFocused.current?.focus?.();
		};
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			className="confirm-dialog fixed inset-0 z-[1000] grid place-items-center"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
			aria-describedby="confirm-desc"
		>
			{/* backdrop */}
			<div className="absolute inset-0 bg-black/40"></div>

			{/* panel */}
			<div className="relative w-[min(520px,92vw)] rounded-xl border border-[var(--surface-border)] bg-[var(--bg-container)] p-5 shadow-xl">
				<h3 id="confirm-title" className="text-lg font-semibold">
					{title}
				</h3>
				{description && (
					<p id="confirm-desc" className="mt-2 text-[var(--text-secondary)]">
						{description}
					</p>
				)}

				<div className="mt-5 flex justify-end gap-2">
					<button
						ref={cancelRef}
						type="button"
						className="btn-cancel rounded-md border border-[var(--surface-border)] bg-[var(--bg-paper)] px-3 py-2"
						onClick={onCancel}
					>
						{cancelText}
					</button>
					<button
						type="button"
						className={
							tone === "danger"
								? "rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
								: "rounded-md bg-[var(--primary-main)] px-3 py-2 text-white hover:brightness-110"
						}
						onClick={onConfirm}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
