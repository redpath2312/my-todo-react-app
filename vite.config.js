import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			plugins: [
				visualizer({
					filename: "stats.html",
					template: "treemap", // treemap view
					gzipSize: true,
					brotliSize: true,
					open: true, // auto-open after build
				}),
			],
		},
	},
	plugins: [react()],
});
