import {fileURLToPath, URL} from 'url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
module.exports = defineConfig({
    envDir: 'env',
    plugins: [
        vue(),
        Components({
            resolvers: [BootstrapVueNextResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            input: {
                index: 'index.html',
            },
        },
    },
    pages: {
        index: {
            entry: './src/index/main.js',
            filename: 'index.html',
            template: 'public/index.html',
            title: 'Weather App',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    }
})
