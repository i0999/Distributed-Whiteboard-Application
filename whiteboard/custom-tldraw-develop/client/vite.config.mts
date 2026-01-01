import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig  } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(() => {
    return {
        base: '/',
        plugins: [react({ tsDecorators: true }), viteSingleFile()],
        root: path.join(__dirname, 'src'),
        publicDir: path.join(__dirname, 'public'),
        server: {
            port: Number.parseInt(process.env.APP_UI_PORT || '5757'),
        },
        optimizeDeps: {
            exclude: ['@tldraw/assets'],
        },
        build: {
            outDir: '../dist'
        }
    };
});
