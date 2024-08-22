import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    includeSource: ['**/*.spec.ts'],
    coverage: {
      all: true,
      include: ['src/**/*'],
    },
    reporters: 'verbose',
  },
});