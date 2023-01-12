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


//  Globals
window.global_keepdata=false;

//  Additional Node Packages
const dayjs = require('dayjs')
Cypress.dayjs = dayjs


// Import commands.js using ES2015 syntax:
import './commands'
import './helpers'


//  Import Reporter
import 'cypress-mochawesome-reporter/register';

//  <Spec Assertion Data>
//const data_em = require('../../data/dev/external_modules.json')

// Alternatively you can use CommonJS syntax:
// require('./commands')

//  Persist session cookie
Cypress.Cookies.defaults({ preserve: "PHPSESSID" })

//  Before all tests
before(()=>{

    
    console.log("process")
    console.log(process.argv)

    cy.login()
    if(!window.global_keepdata) {
        cy.eraseAllData()
    }

    //  Delete older assets
    const downloadsFolder = Cypress.config("downloadsFolder")
    cy.task('deleteFolder', {__dirname: downloadsFolder})

    const ALLOW_BEFORE = process.env.ALLOW_BEFORE

    if(ALLOW_BEFORE) {


    }



})

//  After all tests
after( ()=> {

            //cy.eraseAllData(data_em.em_test_pid)    // erase all data to be safe...
            cy.wait(500)
            cy.logout()
            
    const ALLOW_AFTER = process.env.ALLOW_AFTER

    if(ALLOW_AFTER) {



    }

})