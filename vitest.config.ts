import { defineConfig } from 'vitest/config';

// Own config, so tests don't load the vinext plugin from vite.config.ts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**'],
  },
});
