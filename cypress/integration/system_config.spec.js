// system_config.spec.js tests system configuration:
// general settings
// security settings


//  <Spec Assertion Data>
const data_system_config = require('../../data/system_config.json')

//  <paths>
const path_redcap = '/redcap_v' + Cypress.env('version')
const path_control_center = path_redcap + '/ControlCenter'

describe('system config', () => {
    
    it('validates test user has admin priviliges', ()=>{
        cy.visit( path_control_center + '/superusers.php')
        cy.contains(Cypress.env('username'))
    })

    it('validates general settings', () => {
        cy.visit( path_control_center + '/general_settings.php')
        
        cy.get('input[name=redcap_base_url]').should("have.value", data_system_config.redcap_base_url)
        cy.get('input[name=redcap_survey_base_url]').should("have.value", data_system_config.redcap_survey_base_url)
        cy.get('input[name=project_contact_email]').should("have.value", data_system_config.admin_email)
        
    })

    it('validates security settings', ()=>{
        cy.visit( path_control_center + '/security_settings.php')

        cy.get('select[name=two_factor_auth_enabled]').should("have.value", 1)
        cy.get('select[name=two_factor_auth_ip_check_enabled').should("have.value", 1)
        cy.get('textarea[name=two_factor_auth_ip_range').should("have.value", data_system_config.auth_ip_range)
        cy.get('input[name=two_factor_auth_ip_range_include_private]').should('be.checked')
    })

  })


