// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

//  Additional Node Packages
const dayjs = require('dayjs')
Cypress.dayjs = dayjs


// Import commands.js using ES2015 syntax:
import './commands'
import './helpers'

//  <Spec Assertion Data>
const data_em = require('../../data/external_modules.json')

// Alternatively you can use CommonJS syntax:
// require('./commands')

//  Persist session cookie
Cypress.Cookies.defaults({ preserve: "PHPSESSID" })

//  Before all tests
before(()=>{
    cy.login()
})

//  After all tests
after( ()=> {
    //cy.eraseAllData(data_em.em_test_pid)    // erase all data to be safe...
    cy.logout()
})