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
	{ ignores: ["dist/**", "node_modules/**", "src/Archive/**"] },

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
		},
	},
];
