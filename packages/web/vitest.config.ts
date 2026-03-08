import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		exclude: ["node_modules", "dist"],
		typecheck: {
			tsconfig: "./tsconfig.json",
		},
	},
	plugins: [
		tsConfigPaths({
			projects: ["./tsconfig.json"],
			loose: true,
		}),
	],
});
