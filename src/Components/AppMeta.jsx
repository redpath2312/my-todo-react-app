// components/AppMeta.jsx
import { Helmet } from "react-helmet-async";

const ENV = import.meta.env.VITE_ENV_NAME ?? "development";
const isProd = ENV === "production";

// Global defaults if a page omits props
const DEFAULT_BASE_TITLE = "DashTasker";
const DEFAULT_BASE_DESC =
	"Create, prioritize, and blitz through tasks with DashTasker. Guest mode to take a look or sign in with Email/Google to start managing your tasks now.";

/**
 * Props:
 * - baseTitle?: string   (e.g., "DashTasker — Login")
 * - baseDescription?: string
 * - indexable?: boolean  (default false; only true for public marketing pages)
 * - canonical?: string   (only used if indexable && prod)
 */
export default function AppMeta({
	baseTitle,
	baseDescription,
	indexable = false,
	canonical,
}) {
	const rawTitle = baseTitle ?? DEFAULT_BASE_TITLE;
	const rawDesc = baseDescription ?? DEFAULT_BASE_DESC;

	const title = isProd ? rawTitle : `${rawTitle} (Dev)`;
	const description = isProd ? rawDesc : `Dev Env — ${rawDesc}`;
	const robots = isProd && indexable ? "index,follow" : "noindex,nofollow";

	return (
		<Helmet>
			{/* Default title/template ensure there’s always *some* title */}
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="robots" content={robots} />
			{isProd && indexable && canonical && (
				<link rel="canonical" href={canonical} />
			)}
		</Helmet>
	);
}
