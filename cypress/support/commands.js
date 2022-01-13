// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';

Cypress.Commands.add('login', () => {
    cy.visit('/')
    cy.get('input[name=username]').type(Cypress.env('username'))
    cy.get('input[name=password]').type(Cypress.env('password'))
    cy.get('button#login_btn').click()
    cy.get('#username-reference').contains(Cypress.env('username'))
})

Cypress.Commands.add('logout', () => {    
    const path_control_center = '/redcap_v' + Cypress.env('version') + '/ControlCenter'
    cy.visit( path_control_center + '/index.php?logout=1')
})

Cypress.Commands.add('eraseAllData', (pid) => {
    const path_project_setup = '/redcap_v' + Cypress.env('version') + '/ProjectSetup/other_functionality.php?pid=' + pid
    cy.visit(path_project_setup)
    cy.get('#row_erase button').click()
    cy.get('button.ui-button').contains("Erase all data").click()    
})
