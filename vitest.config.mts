import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['./src/**/*.test.ts'],
    coverage: {
      all: false,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
