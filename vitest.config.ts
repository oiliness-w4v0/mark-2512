import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		setupFiles: "./tests/setup.ts",
		alias: {
			"@": "/src",
		},
		server: {
			deps: {
				external: [/node_modules/],
			},
		},
	},
})
