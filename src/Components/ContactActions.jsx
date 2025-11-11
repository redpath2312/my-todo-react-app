import ContactLink from "./ContactLink";
import CopyEmail from "./CopyEmail";

export default function ContactActions({
	email = "dashtasker.help@outlook.com",
	label = "Feedback / Contact",
}) {
	return (
		<div className="contact-actions">
			<ContactLink label={label} to={email} />
			<span className="sep" aria-hidden>
				•
			</span>
			<CopyEmail address={email} />
		</div>
	);
}
