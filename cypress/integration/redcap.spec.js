// redcap.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


//  cypress.env.json
const redcap_version = Cypress.env('version')
const username = Cypress.env('username')
const password = Cypress.env('password')

//  Server Configuration 
const redcap_base_url = 'https://redcap-dev.swisstph.ch/redcap/'
const redcap_survey_base_url = 'https://survey-dev.swisstph.ch/redcap/'
const admin_email = 'redcap@swisstph.ch'

//  Security Settings
const auth_ip_range= "131.152.*.*"

//  External Modules
const em_available = [
    "Address Auto Complete", 
    "Admin Dashboard",
    "Auto Record Generation",
    "Big Data Import",
    "Complete Row",
    "Custom Participant Export",
    "Custom Survey Landing Page",
    "Data Quality API",
    "Data Resolution Workflow Tweaks",
    "Date Validation Action Tags",
    "Export Data Dictionary Changes",
    "Instance Table",
    "Language Editor",
    "Mass Delete",
    "Multilingual",
    "Orca Search Module",
    "PDF Injector",
    "Repeat Survey Link",
    "Simple Ontology Module",
    "Survey Queue Interface",
    "Unique Action Tag",
    "Vizr - Visualizer for temporal summary reporting"
]


//  paths
const redcap_path = '/redcap_v'+redcap_version
const control_center = redcap_path + '/ControlCenter'
const external_modules = redcap_path + '/ExternalModules/manager/control_center.php'

// now any cookie with the name 'session_id' will
// not be cleared before each test runs
Cypress.Cookies.defaults({
    preserve: "PHPSESSID"
  })


describe('Test System Config', () => {

    it('visits REDCap Development Server', () => {
        cy.visit('/')
        cy.contains("form")
    })

    it('signs in test user', ()=> {
        //  Sign in
        cy.get('input[name=username]').type(username)
        cy.get('input[name=password]').type(password)
        cy.get('button#login_btn').click()
        //  Check
        cy.get('#username-reference').contains(username)
    })

    it('has admin priviliges', ()=>{
        cy.visit( control_center + '/superusers.php')
        cy.contains(username)
    })

    it('validates general settings', () => {
        cy.visit(control_center + '/general_settings.php')
        
        cy.get('input[name=redcap_base_url]').should("have.value", redcap_base_url)
        cy.get('input[name=redcap_survey_base_url]').should("have.value", redcap_survey_base_url)
        cy.get('input[name=project_contact_email]').should("have.value", admin_email)
        
    })

    it('validates security settings', ()=>{
        cy.visit(control_center + '/security_settings.php')

        cy.get('select[name=two_factor_auth_enabled]').should("have.value", 1)
        cy.get('select[name=two_factor_auth_ip_check_enabled').should("have.value", 1)
        cy.get('textarea[name=two_factor_auth_ip_range').should("have.value", auth_ip_range)
        cy.get('input[name=two_factor_auth_ip_range_include_private]').should('be.checked')
    })

  })

  describe('Test External Modules Config', ()=>{
    
    before(() => {
        cy.visit(external_modules)
    })

    em_available.forEach((em)=> {
        it( "has '"+ em + "' enabled", ()=>{
            cy.get('#external-modules-enabled')
            .should('contain', em) 
        })
    })

  })
  
  describe('Test Finalization', () => {

    it('sings out', ()=>{
        cy.visit(control_center + '/index.php?logout=1')
    })

  })