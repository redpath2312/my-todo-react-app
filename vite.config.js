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

					if (id.includes("/react/") || id.includes("react-dom"))
						return "react";
					if (id.includes("@mui/")) return "mui"; // core + base + system + material
					if (id.includes("firebase")) return "firebase"; // firebase modular SDK
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
