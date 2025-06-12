import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import macrosPlugin from 'vite-plugin-babel-macros';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import qiankun from 'vite-plugin-qiankun';
import html from '@rollup/plugin-html';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
const useDevMode = true;
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Via https://stackoverflow.com/a/66389044.
    const env = loadEnv(mode, process.cwd(), '');
    process.env = { ...process.env, ...env };
    console.log('process----', process);

    // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    const themeConfig = require(`./src/Lineage/conf/theme/theme_light.config.json`);
    // const themeConfig = import(`./src/conf/theme/${process.env.REACT_APP_THEME_CONFIG}`);

    // Setup proxy to the datahub-frontend service.
    const frontendProxy = {
        // target: process.env.REACT_APP_PROXY_TARGET || 'http://localhost:9002',
        target: 'http://192.168.1.46:9002',
        changeOrigin: true,
    };
    const proxyOptions = {
        '/logIn': frontendProxy,
        '/authenticate': frontendProxy,
        '/api/v2/graphql': frontendProxy,
        '/track': frontendProxy,
        '/DataResMgr': {
            target: 'http://192.168.1.86:2061',
            changeOrigin: true,
        }
        // '/assets': frontendProxy,
    };

    return {
        appType: 'spa',
        // base: './',
        // base:
        //     process.env.NODE_ENV === 'production'
        //         ? '/datahub-react-web/' // 生产环境路径（需与主应用 activeRule 一致）
        //         : '/',
        // base: '/portal-1/datahub',
        // base: '/',
        plugins: [
            react(),
            qiankun('datahub-react-web', {
                useDevMode: true, // 开发模式热更新关闭
            }),
            svgr(),
            macrosPlugin(),
            viteStaticCopy({
                targets: [
                    // Self-host images by copying them to the build directory
                    { src: 'src/images/*', dest: 'assets/platforms' },
                    // Also keep the theme json files in the build directory
                    { src: 'src/conf/theme/*.json', dest: 'assets/conf/theme' },
                ],
            }),
            viteStaticCopy({
                targets: [
                    // Copy monaco-editor files to the build directory
                    // Because of the structured option, specifying dest .
                    // means that it will mirror the node_modules/... structure
                    // in the build directory.
                    {
                        src: 'node_modules/monaco-editor/min/vs/',
                        dest: '.',
                    },
                    {
                        src: 'node_modules/monaco-editor/min-maps/vs/',
                        dest: '.',
                        rename: (name, ext, fullPath) => {
                            console.log(name, ext, fullPath);
                            return name;
                        },
                    },
                ],
                structured: true,
            }),
        ],
        optimizeDeps: {
            exclude: ['@react-refresh'], // 让 Vite 不处理 react-refresh
        },
        define: {
            'process.env.FAST_REFRESH': false, // 这样 Vite 不会加载 react-refresh
        },
        // optimizeDeps: {
        //     include: ['@ant-design/colors', '@ant-design/icons', 'lodash-es', '@ant-design/icons/es/icons'],
        // },
        envPrefix: 'REACT_APP_',
        build: {
            outDir: 'dist',
            target: 'esnext',
            minify: 'esbuild',
            reportCompressedSize: false,
            // Limit number of worker threads to reduce CPU pressure
            workers: 3, // default is number of CPU cores
            // lib: {
            //     entry: path.resolve(__dirname, 'src/index.tsx'),
            //     name: `datahub-react-web`, // 类似于 output.library
            //     formats: ['umd'],
            // },
            // rollupOptions: {
            //     output: {
            //         manualChunks: undefined,
            //         inlineDynamicImports: true,
            //         format: 'umd',
            //         //  format: 'esm',
            //         // chunkFileNames: `webpackJsonp_${'datahub-react-web'}-[name].js`, // 类似于 jsonpFunction
            //         chunkLoadingGlobal: `webpackJsonp_${'datahub-react-web'}`,
            //         globals: {
            //             react: 'React',
            //             'react-dom': 'ReactDOM',
            //         },
            //         // interop: 'auto',
            //         // exports: 'named',
            //     },
            // },
        },
        server: {
            // open: false,
            // host: false,
            port: 3000,
            proxy: proxyOptions,
            cors: true,
            hmr: false,
            // origin: 'http://127.0.0.1:3000',
            headers: {
                'Access-Control-Allow-Origin': '*', // 允许所有来源
            },
            // base: '/portal-1/microapp1/',
            // base: '/',
            // qiankun: {
            //     slave: {},
            // },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    // Override antd theme variables.
                    // https://4x.ant.design/docs/react/customize-theme#Ant-Design-Less-variables
                    modifyVars: themeConfig.styles,
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/setupTests.ts',
            css: true,
            // reporters: ['verbose'],
            coverage: {
                enabled: true,
                provider: 'v8',
                reporter: ['text', 'json', 'html'],
                include: ['src/**/*'],
                reportsDirectory: '../build/coverage-reports/datahub-web-react/',
                exclude: [],
            },
        },
        resolve: {
            alias: {
                // // Root Directories
                // '@': path.resolve(__dirname, './src'),
                // '@src': path.resolve(__dirname, './src'),
                // '@app': path.resolve(__dirname, './src/app'),
                // '@conf': path.resolve(__dirname, './src/conf'),
                // '@components': path.resolve(__dirname, './src/alchemy-components'),
                // '@graphql': path.resolve(__dirname, './src/graphql'),
                // '@graphql-mock': path.resolve(__dirname, './src/graphql-mock'),
                // '@images': path.resolve(__dirname, './src/images'),
                // '@providers': path.resolve(__dirname, './src/providers'),
                // '@utils': path.resolve(__dirname, './src/utils'),
                // // '@assets': path.resolve(__dirname, './src/assets'),
                // // App Specific Directories
                // // '@app/entityV1': path.resolve(__dirname, 'src/app/entity'),
                // // '@app/entityV2': path.resolve(__dirname, 'src/app/entityV2'),
                // // '@app/searchV2': path.resolve(__dirname, 'src/app/searchV2'),
                // // '@app/domainV2': path.resolve(__dirname, 'src/app/domainV2'),
                // // '@app/glossaryV2': path.resolve(__dirname, 'src/app/glossaryV2'),
                // // '@app/homeV2': path.resolve(__dirname, 'src/app/homeV2'),
                // // '@app/lineageV2': path.resolve(__dirname, 'src/app/lineageV2'),
                // // '@app/previewV2': path.resolve(__dirname, 'src/app/previewV2'),
                // // '@app/sharedV2': path.resolve(__dirname, 'src/app/sharedV2'),

                // // Specific Files
                // '@types': path.resolve(__dirname, './src/types.generated.ts'),
            },
        },
    };
});
