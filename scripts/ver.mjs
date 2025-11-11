#!/usr/bin/env node
// scripts/ver.mjs
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

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
function readVer() {
	return JSON.parse(readFileSync("package.json", "utf8")).version;
}
function validBase(b) {
	return ["patch", "minor", "major"].includes(b);
}

const [, , stage, arg1, arg2] = process.argv;
// Usage:
//   node scripts/ver.mjs feat <code> [patch|minor|major]
//   node scripts/ver.mjs rc [patch|minor|major]
//   node scripts/ver.mjs final [patch|minor|major]

if (stage === "final") {
	// Require a clean tree for prod releases, and create a real git tag
	clean();
	const base = validBase(arg1) ? arg1 : "minor";
	run(`npm version ${base}`);
	process.exit(0);
}

const current = readVer();

if (stage === "feat") {
	const code = arg1;
	const base = validBase(arg2) ? arg2 : "minor";
	if (!/^[a-z0-9]{3,5}$/.test(code || "")) {
		console.error(
			"Feature code must be 3–5 lowercase letters/digits (e.g., fdbck, enc)."
		);
		process.exit(1);
	}

	if (current.includes(`-feat.${code}.`)) {
		// Already on this feature line → just bump the counter
		run(`npm version --no-git-tag-version prerelease`);
	} else if (current.includes("-")) {
		// On some other prerelease (e.g., -rc.* or -feat.other.*) → still bump plainly
		run(`npm version --no-git-tag-version prerelease`);
	} else {
		// Starting fresh prerelease line for this feature
		run(`npm version --no-git-tag-version pre${base} --preid=feat.${code}`);
	}
} else if (stage === "rc") {
	const base = validBase(arg1) ? arg1 : "minor";
	if (/-rc\.\d+$/.test(current)) {
		// Already on RC line → bump the counter
		run(`npm version --no-git-tag-version prerelease`);
	} else if (current.includes("-")) {
		// On any prerelease → bump plainly into next prerelease
		run(`npm version --no-git-tag-version prerelease --preid=rc`);
	} else {
		// Start RCs from chosen base
		run(`npm version --no-git-tag-version pre${base} --preid=rc`);
	}
} else {
	console.log("Usage:");
	console.log("  node scripts/ver.mjs feat <code> [patch|minor|major]");
	console.log("  node scripts/ver.mjs rc [patch|minor|major]");
	console.log("  node scripts/ver.mjs final [patch|minor|major]");
	process.exit(1);
}
