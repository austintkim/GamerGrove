import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            js,
            prettier: pluginPrettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            "prettier/prettier": "error",
        },
    },
    pluginReact.configs.flat.recommended,
]);
