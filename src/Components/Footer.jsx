import AppVersionBadge from "./AppVersionBadge";

function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer>
			<p>Copyright ⓒ {year}</p>
			<AppVersionBadge />
		</footer>
	);
}

export default Footer;
