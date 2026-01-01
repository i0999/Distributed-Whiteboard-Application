import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(() => {
    return {
        plugins: [react({ tsDecorators: true })],
        root: path.join(__dirname, 'src/client'),
        publicDir: path.join(__dirname, 'public'),
        server: {
            port: Number.parseInt(process.env.APP_UI_PORT || '5757'),
        },
        optimizeDeps: {
            exclude: ['@tldraw/assets'],
        },
    };
});
