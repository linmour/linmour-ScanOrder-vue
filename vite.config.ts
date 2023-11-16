import {fileURLToPath, URL} from 'node:url'
import Windicss from 'vite-plugin-windicss'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    server: {

        proxy: {
            '/api': {
                target: 'http://127.0.0.1:12800',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        port: 12808,
        https: false,
        host: true,
        open: true,
    },

    plugins: [
        vue(),
        Windicss(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
            symbolId: 'icon-[dir]-[name]',
        }),

    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },


})
