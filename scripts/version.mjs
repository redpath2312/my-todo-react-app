// scripts/version.mjs
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const semver = pkg.version;

function sh(cmd) {
	try {
		return execSync(cmd, { encoding: "utf-8" }).trim();
	} catch {
		return "nogit";
	}
}
const sha = sh("git rev-parse --short HEAD");
const channel = process.env.CHANNEL || "dev";
const ts = new Date().toISOString();

const appVersion = `${semver}+${channel}.${sha}.${ts}`;

writeFileSync(
	"src/version.ts",
	`export const APP_VERSION="${appVersion}";export const BASE_SEMVER="${semver}";export const CHANNEL="${channel}";export const GIT_SHA="${sha}";export const BUILD_TIME="${ts}";\n`
);
writeFileSync(".env.version", `VITE_APP_VERSION=${appVersion}\n`);
console.log("Built version:", appVersion);
