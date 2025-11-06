// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import a11y from "eslint-plugin-jsx-a11y";
import unused from "eslint-plugin-unused-imports";

export default [
	// Ignore build artifacts
	{ ignores: ["dist/**", "node_modules/**", "src/Archive/**", "scripts/**"] },

	// Base JS recommendations
	js.configs.recommended,

	// App files
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: { ...globals.browser },
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		settings: { react: { version: "detect" } },
		plugins: {
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"jsx-a11y": a11y,
			"unused-imports": unused,
		},
		rules: {
			// React presets
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,

			// ⬇️ a11y essentials
			...(a11y.configs.recommended?.rules ?? {}), // pull in plugin defaults
			"jsx-a11y/alt-text": [
				"error",
				{ elements: ["img"], img: [] /* allow alt="" for decorative */ },
			],
			"jsx-a11y/img-redundant-alt": "warn", // flags alt="image of..." / "logo of..."
			"jsx-a11y/anchor-is-valid": [
				"warn",
				{ aspects: ["noHref", "invalidHref", "preferButton"] },
			],
			"jsx-a11y/no-redundant-roles": "warn",
			"jsx-a11y/click-events-have-key-events": "warn",
			"jsx-a11y/interactive-supports-focus": "warn",

			// Autofixable cleanup
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"error",
				{
					args: "after-used",
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
				},
			],

			// Reasonable noise control
			"no-console": ["warn", { allow: ["warn", "error", "info"] }],
			"react/prop-types": "off",
			"react/jsx-no-target-blank": "off",

			// Vite fast-refresh nicety (warn-level)
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],

			"react/no-unknown-property": [
				"error",
				{ ignore: ["fetchpriority", "imagesrcset", "imagesizes", "srcset"] },
			], //was being flagged in the browser console
		},
	},

	// ⬇️ Per-file override for your logger helper
	{
		files: ["src/utils/logger.js"],
		rules: {
			"no-console": "off", // allow log/info/time/timeEnd here
		},
	},
];
