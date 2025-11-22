import ContactLink from "./ContactLink";
export default function DataPrivacy() {
	return (
		<div className="space-y-3">
			<p>
				DashTasker stores your tasks in Google Cloud Firestore, scoped to your
				account only.
			</p>
			<ul className="list-disc pl-5 space-y-1">
				<li>
					Card text is encrypted in your browser before it is saved (AES via{" "}
					<code>crypto-js</code>).
				</li>
				<li>
					Only encrypted text is stored in Firestore; task text is decrypted on
					your device when you load the app.
				</li>
				<li>
					Cards created before the encryption release (v0.11.0) may still be
					stored in plaintext until you edit their text once.
				</li>
				<li>
					Guest mode does not store tasks in the cloud – they stay in your
					current browser session only.
				</li>
				<li>
					This is a personal project, not a commercial service – please avoid
					storing highly sensitive information (passwords, bank details, etc.)
					in tasks.
				</li>
				<li>
					Your display name and email address are stored with your account in
					Firebase and are visible only to the DashTasker project owner via the
					Firebase console. They are not shared with other users.
				</li>
				<li>
					Other card details like ID, priority flags (high priority / Dash
					Task), and done status are stored as normal metadata (not encrypted).
					Only the card <em>text</em> itself is encrypted.
				</li>
				<li>
					If you&apos;d like your account and all associated data to be deleted,
					please contact me at{" "}
					<a
						href="mailto:peterpredpath@outlook.com"
						className="underline text-[var(--primary-main)]"
					>
						dashtasker.help@outlook.com
					</a>{" "}
					(or use the <ContactLink /> form), and I&apos;ll remove it.
				</li>
			</ul>
		</div>
	);
}
