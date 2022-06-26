/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: {
      web: [ /\.[jt]sx$/ ],
    },
    setupFiles: [ "./vitest.setup.js" ],
  },
});
