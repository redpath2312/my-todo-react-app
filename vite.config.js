import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;

					// Path segment after node_modules/
					const seg = id.split("node_modules/")[1];

					// Top-level package key: "@scope/pkg" or "pkg"
					const top = seg.startsWith("@")
						? seg.split("/", 2).join("/") // e.g. "@mui/material"
						: seg.split("/", 1)[0]; // e.g. "react"

					// Keep React bits together
					if (
						top === "react" ||
						top === "react-dom" ||
						top === "scheduler" ||
						top === "object-assign"
					) {
						return "react";
					}

					// Emotion (MUI depends on it) — keep separate from react
					if (top.startsWith("@emotion/")) return "emotion";

					// MUI family
					if (top.startsWith("@mui/")) return "mui";

					// Firebase — optionally split auth vs firestore (see alt below)
					if (top === "firebase") return "firebase";

					// Everything else
					return "vendor";
				},
			},
			plugins: [
				visualizer({
					filename: "stats.html",
					template: "treemap",
					gzipSize: true,
					brotliSize: true,
					open: false,
				}),
			],
		},
	},
});
