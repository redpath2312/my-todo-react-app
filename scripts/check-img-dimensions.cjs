const { readFileSync, readdirSync } = require("fs");
const { join, sep } = require("path");

const SRC = "src";
const IGNORE_DIRS = [
	`${sep}Archive${sep}`, // skip src/Archive/**
	`${sep}__tests__${sep}`, // example
];

let fail = false;

function isIgnored(filePath) {
	const norm = filePath.split("/").join(sep);
	return IGNORE_DIRS.some((seg) => norm.includes(seg));
}

function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, entry.name);
		if (isIgnored(p)) continue;
		if (entry.isDirectory()) {
			walk(p);
		} else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
			const text = readFileSync(p, "utf8");
			const imgTags = text.match(/<img\b[\s\S]*?>/g) || [];
			for (const tag of imgTags) {
				// crude skip for commented chunks
				if (/^\s*{?\s*\/\*/.test(tag) || /{\s*\/\//.test(tag)) continue;
				const hasW = /\bwidth\s*=/.test(tag);
				const hasH = /\bheight\s*=/.test(tag);
				if (!(hasW && hasH)) {
					const firstLine = tag.split("\n")[0].slice(0, 140);
					console.error(
						`❌ Missing width/height in ${p}\n   ${firstLine}...\n`
					);
					fail = true;
				}
			}
		}
	}
}

walk(SRC);
if (fail) process.exit(1);
console.log(
	"✅ All <img> tags specify width & height (excluding ignored dirs)."
);
