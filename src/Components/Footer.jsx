import AppVersionBadge from "./AppVersionBadge";
import ContactActions from "./ContactActions";

function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="footer">
			<p>Copyright ⓒ {year}</p>
			<ContactActions />
			<AppVersionBadge />
		</footer>
	);
}

export default Footer;
