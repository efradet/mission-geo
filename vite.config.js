import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// base relative : le site fonctionne aussi bien en local que sur GitHub Pages (/mission-geo/).
export default defineConfig({plugins: [react()], base: './'});
