import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			react: pluginReact,
			prettier: pluginPrettier,
		},
		rules: {
			...js.configs.recommended.rules,
			...pluginReact.configs.flat.recommended.rules,
			'prettier/prettier': 'error',
		},
	},
]);
