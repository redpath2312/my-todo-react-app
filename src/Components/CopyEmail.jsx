import { useState } from "react";

export default function CopyEmail({ address = "dashtasker.help@outlook.com" }) {
	const [copied, setCopied] = useState(false);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// very old browsers: fall back to prompt
			window.prompt("Copy email address:", address);
		}
	};
	return (
		<button
			type="button"
			className="underline hover:no-underline text-sm"
			onClick={copy}
			aria-label="Copy support email address"
		>
			{copied ? "Copied ✓" : "Copy email"}
		</button>
	);
}
