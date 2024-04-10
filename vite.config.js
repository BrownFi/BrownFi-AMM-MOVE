import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
	return defineConfig({
		plugins: [react()],
	});
};
