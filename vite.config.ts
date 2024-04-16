import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import AntdvResolver from 'antdv-component-resolver';

import visualizer from 'rollup-plugin-visualizer';

import shelljs from 'shelljs';
import pkg from './package.json';

const { name, homepage, issuepage, releasepage, version } = pkg;
const __APP_INFO__ = {
  pkg: { name, version, homepage, issuepage, releasepage },
  git: {
    hash: shelljs.exec('git rev-parse --short HEAD', { silent: true }).stdout.trim(),
    branch: shelljs.exec('git symbolic-ref --short HEAD', { silent: true }).stdout.trim(),
    date: shelljs.exec('git log -1 --format="%cd"', { silent: true }).stdout.trim(),
  },
  buildTime: new Date().toLocaleString('en-US'),
};

const plugins: any[] = [];
if (process.env.REPORT === 'true') plugins.push(visualizer({ open: true, gzipSize: true, brotliSize: true }));

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const buildgen = {
  lib: {
    entry: pathResolve('src/gen.ts'),
    name: 'xpkt_protocol',
    fileName: (format) => `xpkt_protocol.${format}.js`,
  },
  sourcemap: true,
  rollupOptions: {
    external: ['vue'],
    output: { globals: { vue: 'Vue' } },
  },
};
const buildview = { target: 'esnext', chunkSizeWarningLimit: 2000 };

export default defineConfig(({ command, mode }) => {
  console.log('[vite.config.ts] command %s mode %s', command, mode);
  return {
    base: './',
    resolve: {
      alias: [
        { find: /@\//, replacement: pathResolve('src') + '/' },
        { find: /#\//, replacement: pathResolve('types') + '/' },
      ],
    },
    define: { __APP_INFO__ },
    plugins: [vue(), Components({ resolvers: [AntdvResolver()] }), ...plugins],
    server: { host: true, port: 8080 },
    build: mode === 'gen' ? buildgen : buildview,
    esbuild: { drop: mode === 'production' ? ['console', 'debugger'] : [] },
  };
});
