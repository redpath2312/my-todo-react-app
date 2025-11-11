// AppVersionBadge.jsx
import { APP_VERSION } from "../version";
export default function AppVersionBadge() {
	const [semver] = APP_VERSION.split("+");
	return (
		<span title={APP_VERSION} className="text-xs text-gray-500">
			v{semver}
		</span>
	);
}
