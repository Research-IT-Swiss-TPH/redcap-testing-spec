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


const data_em = require('../../data/'+Cypress.env('environment')+'/external_modules.json')
const path_redcap = '/redcap_v' + Cypress.env('version')

Cypress.Commands.add('login', () => {
    cy.visit('/')
    cy.get('input[name=username]').type(Cypress.env('username'))
    cy.get('input[name=password]').type(Cypress.env('password'))
    cy.get('button#login_btn').click()
    //cy.get('#username-reference').contains(Cypress.env('username'))
})

Cypress.Commands.add('logout', () => {    
    const path_control_center = '/redcap_v' + Cypress.env('version') + '/ControlCenter'
    cy.visit( path_control_center + '/index.php?logout=1')
})

Cypress.Commands.add('moduleIsEnabled', (name) => {
    cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
    cy.get('#external-modules-enabled').should("contain", name)         
})

Cypress.Commands.add('visitRecordHomePage', (record=1) => {
    cy.visit( path_redcap + '/DataEntry/record_home.php?arm=1&id='+ record +'&pid=' + data_em.em_test_pid )
})

Cypress.Commands.add('editRecordFor', (instrument, record=1, instance=1, pid=data_em.em_test_pid) => {
    cy.visit(path_redcap + '/DataEntry/index.php?page='+instrument+'&id='+record+'&pid=' + pid + '&instance=' + instance)
})

Cypress.Commands.add('deleteRecord', (record, pid=data_em.em_test_pid) => {
    cy.visit(path_redcap + '/DataEntry/record_home.php?pid=' + pid + '&id='+record)
    //  Only delete if there is a delete button
    cy.get("body").then($body => {
        if($body.find('#recordActionDropdownTrigger').length > 0) {
            cy.get('#recordActionDropdownTrigger').click()
            cy.get('#recordActionDropdown li a').contains('Delete record (all forms)').click()
            cy.get('button.ui-button').contains('DELETE RECORD').click()
        }
    })
   
})

Cypress.Commands.add('saveRecord', () => {
    cy.get('#submit-btn-saverecord').click()
})

Cypress.Commands.add('saveRecordAndStay', () => {
    cy.get('body').click(0,0);
    cy.get('#submit-btn-savecontinue').click()
})

Cypress.Commands.add('saveModuleConfig', () => {
    cy.get('#external-modules-configure-modal').find('.modal-footer button.save').click()
})

Cypress.Commands.add('eraseAllData', () => {
    const path_project_setup = '/redcap_v' + Cypress.env('version') + '/ProjectSetup/other_functionality.php?pid=' + data_em.em_test_pid
    cy.visit(path_project_setup)
    cy.get('#row_erase button').click()
    cy.get('button.ui-button').contains("Erase all data").click()    
})

Cypress.Commands.add('downloadFromUrl', (url, filename=cy.helpers.getRandomString(10) + ".pdf") => {
    fetch(url)
    .then((res) => { return res.blob()})
    .then((data) => {
        var a = document.createElement("a")
        a.href= window.URL.createObjectURL(data)
        a.download = filename
        a.click()
    })
})

Cypress.Commands.add('compareFiles', (file_local, file_download, deep=false) => {

    cy.fixture(file_local).then(localContent => {
        const downloadsFolder = Cypress.config("downloadsFolder")
        const downloadPath = `${downloadsFolder}/${file_download}`
        cy.readFile(downloadPath).then(downloadedContent => { 

        if(deep) {
            expect(downloadedContent).to.deep.eq(localContent) 
        } else {
            expect(downloadedContent).equals(localContent)   
        }

        })
      })

})
