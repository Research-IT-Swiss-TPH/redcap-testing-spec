const { defineConfig } = require('cypress')

module.exports = defineConfig({
   
    e2e: {
        baseUrl: 'https://redcap-dev.swisstph.ch/redcap',
        specPattern: 'cypress/e2e/external_modules.cy.js'
    }

    // --config baseUrl='https://redcap-dev.swisstph.ch/'

})