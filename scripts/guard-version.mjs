import { readFileSync } from "node:fs";
const ver = JSON.parse(readFileSync("package.json", "utf8")).version;
const channel = process.env.CHANNEL; // dev|preview|prod

const patterns = {
	dev: /^[0-9]+\.[0-9]+\.[0-9]+-feat\.[a-z0-9]{3,5}\.\d+$/, // e.g. 0.10.0-feat.fdbck.3
	preview: /^[0-9]+\.[0-9]+\.[0-9]+-rc\.\d+$/, // e.g. 0.10.0-rc.1
	prod: /^[0-9]+\.[0-9]+\.[0-9]+$/, // e.g. 0.10.0
};

if (!channel || !patterns[channel].test(ver)) {
	console.error(`Version "${ver}" not allowed for CHANNEL=${channel}.`);
	process.exit(1);
}
console.log(`Version OK for ${channel}: ${ver}`);
