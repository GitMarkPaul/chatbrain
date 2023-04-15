import { defineConfig } from 'vite';
import htmlMinifier from 'html-minifier';
import sass from 'sass';
import { resolve } from 'path';
import glob from 'glob';
import { VitePWA } from 'vite-plugin-pwa';

function minifyHtml() {
    return {
        name: 'minify-html',
        transformIndexHtml(html) {
            const minified = htmlMinifier.minify(html, {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
            });
            return minified.replace(/<style>(.*?)<\/style>/gis, (match, p1) => {
                return `<style>${htmlMinifier.minify(p1, { minifyCSS: true })}</style>`;
            });
        },
    };
}

function getHtmlEntries() {
    const entries = {};
    const htmlFiles = glob.sync('*.html');
    htmlFiles.forEach(file => {
        const name = file.replace('.html', '');
        entries[name] = resolve(__dirname, file);
    });
    return entries;
}

export default defineConfig({
    base: '',
    resolve: {
        alias: {
            '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    plugins: [
        minifyHtml(),
        // Add the PWA plugin
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'ChatBrain Assistance for Users',
                short_name: 'ChatBrain',
                icons: [
                    {
                        src: './ic_launcher.png',
                        sizes: '144x144',
                        type: 'image/png'
                    },
                ]
            },
        })
    ],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'terser',
        brotliSize: true,
        rollupOptions: {
            input: {
                app: 'src/js/app.js',
                ...getHtmlEntries(),
            },
            output: {
                dir: 'dist',
            }
        }
    },
    // Configure the Sass preprocessor
    css: {
        preprocessorOptions: {
            scss: {
                implementation: sass
            }
        }
    },
});