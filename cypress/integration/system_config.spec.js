// system_config.spec.js tests system configuration:
// general settings
// security settings
// admin privileges
// external modules


//  <Spec Assertion Data>
const data_system_config = require('../../data/system_config.json')

//  <paths>
const path_redcap = '/redcap_v' + Cypress.env('version')

describe('Test System Config', () => {

    context('General Settings', () => {

        it('validates general settings', () => {
            cy.visit( path_redcap + '/ControlCenter/general_settings.php')
            
            cy.get('select[name=language_global]').should("have.value", data_system_config.language_global)
            cy.get('input[name=redcap_base_url]').should("have.value", data_system_config.redcap_base_url)
            cy.get('input[name=redcap_survey_base_url]').should("have.value", data_system_config.redcap_survey_base_url)
            cy.get('select[name=is_development_server]').should("have.value", data_system_config.is_development_server)
            cy.get('input[name=project_contact_email]').should("have.value", data_system_config.admin_email)
            
        })

    }) 

    context('Security Settings', () => {
        it('validates security settings', ()=>{
            cy.visit( path_redcap + '/ControlCenter/security_settings.php')
    
            cy.get('select[name=two_factor_auth_enabled]').should("have.value", 1)
            cy.get('select[name=two_factor_auth_ip_check_enabled').should("have.value", 1)
            cy.get('textarea[name=two_factor_auth_ip_range').should("have.value", data_system_config.auth_ip_range)
            cy.get('input[name=two_factor_auth_ip_range_include_private]').should('be.checked')
        })
    })

    context('Misc. Settings', () => {        
        it('validates homepage settings', () => {
            cy.visit( path_redcap + '/ControlCenter/homepage_settings.php')

            cy.get('input[name=homepage_contact_email]').should('have.value', data_system_config.homepage_contact_email)
        })    

        it('validates project settings', () => {
            cy.visit( path_redcap + '/ControlCenter/project_settings.php')

            cy.get('select[name=project_language]').should('have.value', data_system_config.project_language)
        })
    
        it('validates admin privileges', ()=>{
            cy.visit( path_redcap + '/ControlCenter/superusers.php')        
            cy.get('#admin-rights-table').should('contain', Cypress.env('username'))
        }) 
    }) 

    context('External Modules Manager', () => {
        it('validates external modules', () => {

            cy.visit(path_redcap + '/ExternalModules/manager/control_center.php')

            data_system_config.external_modules.forEach((em)=> {
                cy.get('#external-modules-enabled')
                .should('contain', em) 
            })

        })   
    })
 

  })


