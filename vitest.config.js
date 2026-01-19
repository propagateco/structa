import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // Allow running tests from any workspace
    passWithNoTests: true,
    // Environment can be overridden in workspace-specific configs
    environment: 'node',
    // Disable console intercept for cleaner test output
    disableConsoleIntercept: true,
  },
});
