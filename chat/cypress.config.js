const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: false, // Disable the support file
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});
