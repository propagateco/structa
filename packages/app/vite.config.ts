import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
    plugins: [
        devtools(),
        viteTsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        tanstackStart(),
        viteReact(),
    ],
    css: {
        postcss: "./postcss.config.js",
    },
});

export default config;
