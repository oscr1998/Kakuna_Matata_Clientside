const { defineConfig } = require('cypress')

module.exports = defineConfig({

  viewportWidth: 1600,
  viewportHeight: 900,
  video: false,
  screenshotOnRunFailure: false,

  e2e: {
    setupNodeEvents(on, config) {
      return config
    }
  }
})
