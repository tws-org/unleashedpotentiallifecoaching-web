import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';
import { responseStoreServiceBinding } from './cloudflare.config';
import { responseStoreAdapter } from '@vinext/cloudflare/cache/response-store-adapter';
import { imagesOptimizer } from '@vinext/cloudflare/images/images-optimizer';

export default defineConfig({
  resolve: {
    alias: [
      // react-datepicker's "browser" field points at a prebuilt CommonJS/UMD
      // bundle, which Vite prefers for the client. Its default export then
      // arrives as an object and React throws #130. Use the ESM build instead.
      {
        find: /^react-datepicker$/,
        replacement: 'react-datepicker/dist/es/index.js',
      },
    ],
  },
  plugins: [
    vinext({
      cache: responseStoreAdapter(),
      prerender: { routes: '*' },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({ auxiliaryWorkers: [{ config: responseStoreServiceBinding }] }),
  ],
});
