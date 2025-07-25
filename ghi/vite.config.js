import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		strictPort: true,
		watch: {
			usePolling: true,
		},
	},
	esbuild: {
		target: 'es2021',
	},
});
