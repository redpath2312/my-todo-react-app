#!/usr/bin/env node
import { execSync } from "node:child_process";

function run(cmd) {
	console.log("> " + cmd);
	execSync(cmd, { stdio: "inherit" });
}
function clean() {
	const out = execSync("git status --porcelain", { encoding: "utf8" }).trim();
	if (out) {
		console.error("Working tree not clean. Commit/stash first.");
		process.exit(1);
	}
}

const [, , stage, arg] = process.argv;
// Usage:
//   node scripts/ver.mjs feat <code>   # start/iterate feature prerelease (no git tag)
//   node scripts/ver.mjs rc            # iterate rc (no git tag)
//   node scripts/ver.mjs final minor   # cut final (creates git tag)

clean();

if (stage === "feat") {
	if (!/^[a-z0-9]{3,5}$/.test(arg || "")) {
		console.error(
			"Feature code must be 3–5 lowercase letters/digits (e.g., fdbck, enc)."
		);
		process.exit(1);
	}
	// Try to bump existing line; if not on it yet, start a preminor line.
	// All prereleases: --no-git-tag-version
	try {
		run(`npm version --no-git-tag-version prerelease --preid=feat.${arg}`);
	} catch {
		run(`npm version --no-git-tag-version preminor --preid=feat.${arg}`);
	}
} else if (stage === "rc") {
	try {
		run(`npm version --no-git-tag-version prerelease --preid=rc`);
	} catch {
		run(`npm version --no-git-tag-version preminor --preid=rc`);
	}
} else if (stage === "final") {
	const base = ["major", "minor", "patch"].includes(arg) ? arg : "minor";
	// Finals create a proper Git tag (default npm behavior)
	run(`npm version ${base}`);
} else {
	console.log("Usage:");
	console.log("  node scripts/ver.mjs feat <code>");
	console.log("  node scripts/ver.mjs rc");
	console.log("  node scripts/ver.mjs final [major|minor|patch]");
	process.exit(1);
}
