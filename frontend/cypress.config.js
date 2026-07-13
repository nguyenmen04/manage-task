import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
