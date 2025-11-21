import { useEffect, useRef } from "react";

export default function ConfirmDialog({
	open,
	title = "Are you sure?",
	description = "",
	confirmText = "Confirm",
	cancelText = "Cancel", // set to null/"" to hide cancel button
	tone = "default", // "danger" | "default" | "warning" | "info"
	onConfirm,
	onCancel,
}) {
	const cancelRef = useRef(null);
	const confirmRef = useRef(null);
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
		requestAnimationFrame(() => {
			if (cancelText && cancelRef.current) {
				cancelRef.current?.focus();
			} else {
				confirmRef.current?.focus();
			}
		});
		return () => {
			window.removeEventListener("keydown", onKey);
			// restore focus to the opener
			previouslyFocused.current?.focus?.();
		};
	}, [open, onCancel, cancelText]);

	if (!open) return null;
	// optional: tweak tone here if you want extra styles

	const baseBtn = "rounded-md px-3 py-2 text-white hover:brightness-75";
	const confirmButtonClass =
		tone === "danger"
			? ` ${baseBtn} bg-[var(--urgent-main)] `
			: tone === "warning"
			? `${baseBtn} bg-[var(--dash-main)]`
			: tone === "success"
			? `${baseBtn} bg-[var(--success-main)]`
			: tone === "info"
			? `${baseBtn} bg-[var(--secondary-main)]`
			: `${baseBtn} bg-[var(--primary-main)] `; // default

	const panelToneClass =
		tone === "danger"
			? "border-[var(--urgent-main)]"
			: tone === "warning"
			? "border-[var(--dash-main)]"
			: tone === "success"
			? "border-[var(--success-main)]"
			: tone === "info"
			? "border-[var(--secondary-main)]"
			: "border-[var(--surface-border)]"; //default
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
			<div
				className={`relative w-[min(520px,92vw)] max-h-[80vh] rounded-xl border ${panelToneClass} bg-[var(--bg-container)] p-4 sm:p-5 shadow-xl flex flex-col`}
			>
				<h3 id="confirm-title" className="text-lg font-semibold">
					{title}
				</h3>

				{description && (
					<div
						id="confirm-desc"
						className="mt-2 text-[var(--text-secondary)] overflow-y-auto pr-1 flex-1"
					>
						{typeof description === "string" ? (
							<p>{description}</p>
						) : (
							description
						)}
					</div>
				)}

				<div className="mt-5 flex justify-end gap-2">
					{cancelText && (
						<button
							ref={cancelRef}
							type="button"
							className="btn-cancel rounded-md border border-[var(--surface-border)] bg-[var(--bg-paper)] px-3 py-2 hover:brightness-75"
							onClick={onCancel}
						>
							{cancelText}
						</button>
					)}
					<button
						ref={confirmRef}
						type="button"
						className={`${confirmButtonClass} btn-confirm`}
						onClick={onConfirm}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
