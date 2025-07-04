module.exports = {
	env: {
	  browser: true,
	  es2021: true,
	  node: true,
	},
	parserOptions: {
	  ecmaFeatures: {
		jsx: true,
	  },
	  ecmaVersion: 12,
	  sourceType: "module",
	},
	plugins: ["react", "react-hooks", "prettier"],
	extends: [
	  "eslint:recommended",
	  "plugin:react/recommended",
	  "plugin:react-hooks/recommended",
	  "plugin:prettier/recommended",
	],
	rules: {
	  "react/react-in-jsx-scope": "off"
	},
	settings: {
		react: {
		  version: "detect",
		  pragma: "React",
		  // Add this line to enable the new JSX transform
		  jsxRuntime: "automatic",
		},
	  },
  };
