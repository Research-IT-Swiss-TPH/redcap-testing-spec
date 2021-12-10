//  external_modules.spec.js
//  Tests external modules availability on system level

//  <Spec Assertion Data>
const data_external_modules = require('../../data/external_modules.json')

// Paths
const path_external_modules = '/redcap_v' + Cypress.env('version') + '/ExternalModules/manager/control_center.php'

describe('external modules config', ()=>{
    
    before(() => {
        cy.visit(path_external_modules)
    })

    data_external_modules.forEach((em)=> {
        it( "has '"+ em + "' enabled", ()=>{
            cy.get('#external-modules-enabled')
            .should('contain', em) 
        })
    })
  })

