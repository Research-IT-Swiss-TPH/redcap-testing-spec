//  external_modules.spec.js: Tests all relevant external modules (productive)

const { interfaces } = require("mocha")

//  <paths>
const data_em = require('../../data/' + Cypress.env('environment') + '/external_modules.json')
const path_redcap = '/redcap_v' + Cypress.env('version')
const path_api = '/api/'

const path_pdfi_document_from = "pdfi_inj_document_from_" + Cypress.env('environment') + ".pdf"
const path_pdfi_document_down = "test_pdfi_1.pdf"


//  Set variables according to environment

// if ( Cypress.env('environment') == 'local') {

// }


describe('Test External Modules', () => {


    /**
     * Auto Record Generation
     * Description: Allows you to create new records in a project (or in the same project) by updating a trigger field. 
     * 
     * Notice: Test can be repeated if module is configured to overwrite given records
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
     context('Auto Record Generation', () => {
        
        const rndm = cy.helpers.getRandomString(10)
        
        it('is enabled', () => {
         cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
         cy.get('#external-modules-enabled').should("contain", "Auto Record Generation")
        })
 
        it('can generate new record', () => {
         cy.visit(path_redcap + '/DataEntry/index.php?page=auto_record_generation&id=1&pid=' + data_em.em_test_pid)
         cy.get('input[name="trigger_field"]').clear().type('check')
         cy.get('input[name="auto_filled"]').clear().type(rndm)
         cy.saveRecord()
        })
 
        it('has auto-generated and filled new record in same project', () => {
         cy.visit(path_redcap + '/DataEntry/index.php?page=auto_record_generation&id=2&pid=' + data_em.em_test_pid)
         cy.get('input[name="trigger_field"]').should('have.value', '')
         cy.get('input[name="auto_filled"]').should('have.value', rndm)
        })
 
     })    

   

    /**
     * Complete Row
     * Description: Simple module to highlight filled rows within a form
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Complete Row', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Complete Row')
        })

        it('colors completed rows', () => {
            cy.visit(path_redcap + '/DataEntry/index.php?page=complete_row&id=1&pid=' + data_em.em_test_pid)
            cy.get('input[name="cr_1"]').type("foo")
            cy.get('input[name="cr_2"]').type("bar")
            cy.get('#submit-btn-dropdown').click()
            cy.get('#submit-btn-savecontinue').click()

            cy.get('#cr_2-tr td.labelrc').should('have.attr', 'style', 'background-color: rgb(219, 247, 223);')
        })

    })

    /**
     * 
     * 
     * Mass Delete (deprecated since REDCap 14.5, due to core integration)
     * Description: Allows deletion of a big amount of data at once.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
/*     context('Mass Delete', ()=>{

        window.global_keepdata=false;

        it('is enabled', ()=>{
            cy.moduleIsEnabled('Mass Delete')
        })
        
        it('can fetch and select all records', () => {
    
            cy.visit( path_redcap + '/ExternalModules/?prefix=mass_delete&page=page_mass_delete&view=record-list&pid=' + data_em.em_test_pid )
            cy.wait(150)
            cy.get('#btn-fetch-records').should('be.visible').click()
            cy.get('button[data-choice="all"]').should('be.visible').click()
    
        })

        it('can delete records', () => {
            cy.get('#btn-delete-selection').click()
            cy.get('button.delete_btn').click()
            cy.get('div.alert.alert-success').should('be.visible')
        })

    }) */

    /**
     * Custom Survey Landing Page
     * Description:  A module for creating a nicer landing page for doing mailers and code entry for surveys
     * 
     * Notice: Does not cover external access and mobile access.
     * 
     * PHP81
     * 
     * @since 1.0.0     
     * 
     */
    context('Custom Survey Landing Page', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Custom Survey Landing Page')
        })

        it('succeeds login with correct SAC', () => {
            cy.visit(path_redcap + '/DataEntry/index.php?id=1&page=base&pid='+ data_em.em_test_pid )
            cy.saveRecord()
            cy.visit(path_redcap + '/Surveys/invite_participants.php?participant_list=1&survey_id='+data_em.custom_survey_landing_survey_id+'&pid=' + data_em.em_test_pid )
            cy.get('#table-participant_table a[href="javascript:;"]').first().click()
            cy.get('input.staticInput').invoke('val').then( ($sac) => {
                cy.visit(path_redcap + '/ExternalModules/?prefix=custom_survey_landing_page&page=survey&pid=' + data_em.em_test_pid)
                cy.get('#access-digit-1').type($sac)
                cy.get('#submit-btn').click()
                cy.get('#surveytitle').should('have.text', 'Custom Survey Landing Page')
            })            
        })

        it('fails login with wrong SAC', ()=>{
            cy.visit(path_redcap + '/ExternalModules/?prefix=custom_survey_landing_page&page=survey&pid=' + data_em.em_test_pid)
            cy.get('#access-digit-1').type('ABCDEFGHS')
            cy.get('#submit-btn').click()
            cy.get('#alert-error').should('have.css', 'display', 'block')
        })

    })

    /**
     * Date Validation Action Tags
     * Description: Action tags to validate date and date time entries as @FUTURE, @NOTPAST, @PAST, @NOTFUTURE.
     * Date Format: d-m-y
     * 
     * Uses dayjs external package.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Date Validation Action Tags', () => {
        
        it('is enabled', () => {
            cy.moduleIsEnabled('Date Validation Action Tags')
        })

        it('validates @FUTURE', () => {            
            cy.visit(path_redcap + '/DataEntry/index.php?id=1&page=date_validation_action_tags&pid=' + data_em.em_test_pid)            
            cy.get('input[name="future"]').type(Cypress.dayjs().subtract(1, 'year').format('DD-MM-YYYY'))
            cy.get('#label-future').click()
            cy.get('#redcapValidationErrorPopup').contains('The value you provided is outside the suggested range')
            cy.get('.ui-dialog-buttonset').contains("Close").click()
        })

        it('validates @NOTPAST', () => {            
            cy.get('input[name="not_past"]').type(Cypress.dayjs().subtract(1, 'year').format('DD-MM-YYYY'))
            cy.get('#label-not_past').click()
            cy.get('#redcapValidationErrorPopup').contains('The value you provided is outside the suggested range')
            cy.get('.ui-dialog-buttonset').contains("Close").click()
        })

        it('validates @PAST', () => {            
            cy.get('input[name="past"]').type(Cypress.dayjs().add(1, 'year').format('DD-MM-YYYY'))
            cy.get('#label-past').click()
            cy.get('#redcapValidationErrorPopup').contains('The value you provided is outside the suggested range')
            cy.get('.ui-dialog-buttonset').contains("Close").click()
        })
        
        it('validates @NOTFUTURE', () => {            
            cy.get('input[name="not_future"]').type(Cypress.dayjs().add(1, 'year').format('DD-MM-YYYY'))
            cy.get('#label-not_future').click()
            cy.get('#redcapValidationErrorPopup').contains('The value you provided is outside the suggested range')
            cy.get('.ui-dialog-buttonset').contains("Close").click()
        })

    })

    /**
     * Instance Table
     * Description: Use the action tag @INSTANCETABLE=form_name in a descriptive text field to include a table showing data from repeat instances of that form.
     * 
     * Uses base/helper_it where @INSTANCETABLE=instance_table is included.
     * Notice: Does not cover longtitudinal projects.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Instance Table', () => {
        
        it('is enabled', () => {
            cy.moduleIsEnabled('Instance Table')
        })

        it('includes instance table', ()=>{
            cy.visit(path_redcap + '/DataEntry/index.php?pid='+data_em.em_test_pid+'&page=instance_table&id=1')
            cy.get('input[name="it_1"]').type('foo')
            cy.get('input[name="it_2"]').type('bar')
            cy.get('input[name="it_3"]').type('lel')
            cy.saveRecord()

            cy.visit(path_redcap + '/DataEntry/index.php?pid='+data_em.em_test_pid+'&id=1&page=instance_table_output')
            cy.get('#MCRI_InstanceTable_it_output_tbl__instance_table').contains('th', 'IT 1')
            cy.get('#MCRI_InstanceTable_it_output_tbl__instance_table').contains('th', 'custom header')
            cy.get('#MCRI_InstanceTable_it_output_tbl__instance_table').contains('td', 'foo')
            cy.get('#MCRI_InstanceTable_it_output_tbl__instance_table').contains('td', 'bar')

        })

    })

    /**
     * Language Editor
     * Description: Allows per project customization of the language.ini settings.
     * 
     * Uses 'em_manage_8' for testing on External Module Manager page.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Language Editor', () => {
        
        it('is enabled', () => {
            cy.moduleIsEnabled('Language Editor')
        })

        it('edits language strings', () => {
            cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('h4').should('contain', '(Language Editor working)')
        })

    })

    
    /**
     * PDF Injector
     * 
     *  To Do
     *  ☐ Inject: multi, 
     * 
     * 
     * @since 1.0.0
     * 
     */
    context('PDF Injector', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('PDF Injector')
        })

        it('cannot upload invalid PDF File', () => {
            cy.visit( path_redcap + '/ExternalModules/?prefix=pdf_injector&page=Injections&pid=' + data_em.em_test_pid)
            cy.get('#addNewInjection').click()

            cy.get('input[type="file"]').selectFile('cypress/fixtures/pdfi_test_document_raw.pdf')

            cy.get('#fpdm-error').should('be.visible')
            cy.get('#btnCloseCodesModal').click()

        })

        it('can upload valid PDF file and read fields', () => {
            cy.visit( path_redcap + '/ExternalModules/?prefix=pdf_injector&page=Injections&pid=' + data_em.em_test_pid)
            cy.get('#addNewInjection').click()

            cy.get('input[type="file"]').selectFile('cypress/fixtures/pdfi_test_document_con.pdf')

            //  Checks
            cy.get('#fpdm-success').should('be.visible')
            cy.get('input[name="title"]').should('have.value', 'pdfi test document con')

            cy.get('#field-0 div').contains("field_1")
            cy.get('#field-1 div').contains("field_2")
            cy.get('#field-2 div').contains("field_3")
        })

        it('can designate fields to form inputs', () => {

            // cy.get('#fieldVariableMatch-0').should('have.attr', 'data-quick-fill-value', 'field_1')

            // cy.get('#fieldVariableMatch-0').type("doesnotexist")
            // cy.get('#fieldVariableMatch-0').focus().blur()
            // cy.get('#variableHelpLine-0').should("have.class", "text-danger")


            cy.get('#fieldVariableMatch-0').should('have.attr', 'data-quick-fill-value', 'field_1')

            cy.get('#fieldVariableMatch-0').clear()
            cy.get('#fieldVariableMatch-0').type("pdfi_text_1")
            cy.get('#fieldVariableMatch-0').focus().blur()
            cy.get('#variableHelpLine-0').should("have.class", "text-success")

            cy.get('#fieldVariableMatch-1').should('have.attr', 'data-quick-fill-value', 'field_2')


            cy.get('#fieldVariableMatch-1').type("pdfi_text_2")
            cy.get('#fieldVariableMatch-1').focus().blur()
            cy.get('#variableHelpLine-1').should("have.class", "text-success")

            cy.get('#fieldVariableMatch-2').should('have.attr', 'data-quick-fill-value', 'field_3')

            cy.get('#fieldVariableMatch-2').type("checkbox_1")
            cy.get('#fieldVariableMatch-2').focus().blur()
            cy.get('#variableHelpLine-2').should("have.class", "text-success")
        })

        it('can save injection', () => {
            cy.get('#btnModalsaveInjection').click()
            cy.get('#injectionsPreview_wrapper #injectionsPreview tbody tr').should("have.length", 1)

        })

        /*    
        Testing preview not possible, because Cypress cannot get DOM elements from within PDF viewer loaded!
        
        it('can preview Injection', () => {
            cy.get('#injectionsPreview_wrapper #injectionsPreview tbody tr #btnGroupDrop2').click()
            cy.get('#injectionsPreview_wrapper #injectionsPreview tbody tr div.dropdown-menu.show .dropdown-item').click()

            cy.get('#modal-pdf-preview input[name="field_1"]').should("have.value", "[pdfi_text_1]")
            cy.get('#modal-pdf-preview textarea[name="field_2"]').contains("[pdfi_text_2]")

        }) */

        it('can edit Injection', () => {

            cy.get("#injectionsPreview_wrapper #injectionsPreview tbody tr .btn-group button.btn:nth-child(1)").first().click()

            cy.get('input[name="title"]').clear().type("foo")
            cy.get('textarea[name="description"]').clear().type("bar")

            cy.get('#btnModalsaveInjection').click()

            cy.get('#injectionsPreview_wrapper #injectionsPreview tbody tr .card-body span').eq(0).contains("foo")
            cy.get('#injectionsPreview_wrapper #injectionsPreview tbody tr .card-body span').eq(1).contains("bar")

        })

        it('has PDF Injection button', () => {
            cy.visitRecordHomePage()
            cy.get('#formSaveTip').should("exist").and("be.visible")
        })

/*         
        fails due to fetch API, may be broken with local

        it('can inject data into single record', () => {

            cy.editRecordFor('pdf_injector')
            cy.get('input[name="pdfi_text_1"]').type("Foo 1")
            cy.get('input[name="pdfi_text_2"]').type("Bar 1")
            cy.saveRecord()

            cy.get("#formSaveTip button").click()
            cy.get('#formSaveTip .dropdown-menu.show a').should("have.attr", "href").then((href) => {
                cy.downloadFromUrl(href, path_pdfi_document_down)
            })

            const _fileLocal = path_pdfi_document_from
            const _fileDownl = path_pdfi_document_down

            cy.compareFiles(_fileLocal, _fileDownl)

        }) */


        it('can delete Injection', () => {
            cy.visit( path_redcap + '/ExternalModules/?prefix=pdf_injector&page=Injections&pid=' + data_em.em_test_pid)

            cy.get("#injectionsPreview_wrapper #injectionsPreview tbody tr .btn-group button.btn:nth-child(1)").first().next().click()

            cy.get('#btnModaldeleteInjection').click()
            cy.get('#injectionsPreview_wrapper').should("not.exist")
        })

    })


    /**
     * Data Quality API
     * Description: Adds Data Quality API endpoints.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Data Quality API', () => {

        let dq

        it('is enabled', () => {
            cy.moduleIsEnabled('Data Quality API')
            cy.editRecordFor('base')
            cy.saveRecordAndStay()
            cy.get('#dc-icon-helper_data_quality_api').click()
            cy.get('#dc-comment').clear().type('foo-dq_api')
            cy.get('#dataResSavBtn').click()
        })

        it('exports data quality', () => {
            cy.request({
                url: path_api + '?NOAUTH&type=module&prefix=data_quality_api&page=export&pid='+data_em.em_test_pid,
                method: 'POST',
                form: true,
                failOnStatusCode: false,
                body: 'token='+cy.helpers.getApiKey()
            }).then((res) => {
                var obj = JSON.parse(res.body)
                dq = obj
                var o = obj[Object.keys(obj)[0]]
                var reso = o.resolutions
                var r = reso[Object.keys(reso)[0]]
                expect(r.comment).to.eq("foo-dq_api")
            })
        })

        it('imports data quality', () => {

            var obj
            obj = dq
            var o = obj[Object.keys(obj)[0]]
            var reso = o.resolutions
            var r = reso[Object.keys(reso)[0]]
            r.ts = "1990-01-01 00:00:00"
            r.comment = "Hello World"

            cy.request({
                url: path_api + '?NOAUTH&type=module&prefix=data_quality_api&page=import&pid='+data_em.em_test_pid,
                method: 'POST',
                form: true,
                failOnStatusCode: false,
                body: 'token='+cy.helpers.getApiKey() + '&data=' + JSON.stringify(obj)
            }).then((res) => {
                var id = JSON.parse(res.body)[0]
                cy.editRecordFor('base')
                cy.get('#dc-icon-helper_data_quality_api').click()
                cy.get('#res_id-'+id).should("contain", "Hello World")
            })
        })
    })

    /**
     * Data Resolution Workflow Tweaks
     * Shows/hides "Verify all fields" button
     * tbd
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
     context('Data Resolution Workflow Tweaks', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Data Resolution Workflow Tweaks')
        })

        it('shows "Verify all fields" button', () => {
            cy.editRecordFor('base')
            //  Could be not found when DRW is not enabled in Project Setup > Additional Customizations (Import Issue suspected)
            cy.get('button#MCRI_DRWTweaks_Button').should('be.visible')
        })

    })    

    /**
     * Orca Search Module
     * Description: A configurable, searchable, and performant, list dashboard.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Orca Search Module', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Orca Search Module')
        })

        it('has record with field oid', () => {
            cy.visit(path_redcap + '/DataEntry/index.php?page=orca_search&id=1&pid=' + data_em.em_test_pid)
            cy.get('input[name="oid"]').clear().type('foo')
            cy.saveRecord()
        })

        //  needs write permissions on module directory
        it('can search for oid', () => {
            cy.visit(path_redcap + '/ExternalModules/?prefix=orca_search&page=search&pid='+ data_em.em_test_pid)
            cy.get('#search-value').type("foo")
            cy.get('#orca-search').click()
            cy.get('.orca-search-content').should('have.text', 'foo');
        })
    })

    /**
     * Shazam
     * Description: Shazam allows you to define a html template to rearrange the fields on a redcap form or survey instrument.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
     context('Shazam', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Shazam')
        })

        it('has basic HTML Output', () => {
            cy.visit(path_redcap + '/DataEntry/index.php?page=shazam&id=1&pid=' + data_em.em_test_pid)
            cy.get('#test-shazam-headline').should('have.text', 'Hello from Shazam');
        })
    })    
    
    // /**
    //  * Simple Ontology Module
    //  * Description: Example implementation of Ontology Provider add in 8.8.1. 
    //  * This module allows a site wide set of code/displays to defined and then referenced as an ontology.
    //  * 
    //  * PHP81
    //  * 
    //  * @since 1.0.0
    //  */
    // context('Simple Ontology Module', () => {

    //     it('is enabled', () => {
    //         cy.moduleIsEnabled('Simple Ontology Module')
    //     })

    //     it('can enter Input from Dropdown', () => {
    //         cy.visit(path_redcap + '/DataEntry/index.php?page=simple_ontology&id=1&pid=' + data_em.em_test_pid)
    //         cy.get('#test_ontology-autosuggest-span').click()
    //         cy.get('#test_ontology-autosuggest').type('foo')
    //         cy.get('ul.ui-menu').not('#pdfExportDropdown').find('li.ui-menu-item a.ui-menu-item-wrapper').click()
    //         cy.get('input[name="test_ontology"').should('have.value', 'Foo')
    //     })
    // })

    /**
     * Vizr
     * Vizr provides a way for project designers to create charts summarizing 
     * their data in a time series fashion to provide additional insights about their project.
     * 
     * PHP81
     * 
     * @since 1.0.0
     * 
     */
    context('Vizr', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Vizr')

            //  add vizr record
            cy.editRecordFor('vizr')
            cy.get('#vizr_date-tr td button').click()
            cy.saveRecord()
        })


        it('renders chart', () => {
            cy.visit( path_redcap + '/ExternalModules/?prefix=vizr&page=index&pid=' + data_em.em_test_pid)
            cy.get('.vizr-charts canvas').should('be.visible')
            cy.get('.vizr-chart-summary table tbody tr td').first().should('have.text', 1)
        })

    })

    /**
     * Custom Participant Export
     * A simple external module for REDCap that enables custom participant export to CSV. 
     * 
     * 
     * ☐ Custom Export 
     * ☐ Edit configuration
     * 
     * @since 1.0.0
     */
    

    /**
     * Unique Action Tag
     * Description: A REDCap external module providing action tags that make fields unique in Data Entry.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
     context('Unique Action Tag', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Unique Action Tag')
        })

        it('blocks duplicates for @UNIQUE', () => {
            cy.editRecordFor('unique_action_tag', 1)
            //cy.visit(path_redcap + '/DataEntry/index.php?page=unique_action_tag&id=1&pid=' + data_em.em_test_pid)
            cy.get('input[name="unique"]').clear().type("foo1")
            cy.get('body').click(0,0);
            cy.saveRecord()

            cy.editRecordFor('unique_action_tag', 2)
            //cy.visit(path_redcap + '/DataEntry/index.php?page=unique_action_tag&id=2&pid=' + data_em.em_test_pid)            
            cy.get('input[name="unique"]').clear().type("foo1")
            cy.get('body').click(0,0);
            cy.get('#suf_warning_dialog').should('be.visible')
        })

        it('blocks duplicates for @UNIQUE-STRICT (cross-record)', () => {
            cy.editRecordFor('unique_action_tag', 1)
            //cy.visit(path_redcap + '/DataEntry/index.php?page=unique_action_tag&id=1&pid=' + data_em.em_test_pid)
            cy.get('input[name="unique_strict"]').clear().type("bar1")
            cy.get('input[name="helper_unique_strict"').clear().type("bar2")
            cy.get('body').click(0,0);
            cy.saveRecord()

            cy.editRecordFor('unique_action_tag', 2)
            //cy.visit(path_redcap + '/DataEntry/index.php?page=unique_action_tag&id=2&pid=' + data_em.em_test_pid)
            cy.get('input[name="unique_strict"]').clear().type("bar2")
            cy.get('body').click(0,0);
            cy.get('#suf_warning_dialog').should('be.visible')
        })

        it('blocks duplicates for @UNIQUE-STRICT (same-record)', () => {
            //  close warning
            cy.get('[aria-describedby="suf_warning_dialog"] .ui-dialog-buttonpane button.ui-button').click()

            cy.get('input[name="helper_unique_strict"').clear().type("bar3")
            cy.get('input[name="unique_strict"]').clear().type("bar3")
            cy.get('body').click(0,0);
            cy.get('input[name="unique_strict"]').should('have.class', 'has-duplicate-warning')
            cy.get('input[name="helper_unique_strict"]').should('have.class', 'has-duplicate-warning')
        })
    })


    // /**
    //  * Repeat Survey Link
    //  * 
    //  * PHP81
    //  * 
    //  * @since 1.0.0
    //  * 
    //  */
    // context('Repeat Survey Link', () => {

    //     it('is enabled', () => {
    //         cy.moduleIsEnabled('Repeat Survey Link')
    //     })

    //     it('links to next instance (1=>2)', () => {     
            
    //         //  Add instance 1
    //         cy.editRecordFor('repeat_survey_link')
    //         cy.saveRecord()

    //         //  Check first rsl
    //         cy.editRecordFor('base')
    //         cy.get('input[name="helper_rsl"]').invoke('val').then((rsl) => {
    //             cy.visit(rsl)
    //             cy.get('input[name="rsl_current_instance"]').should('have.value', 2)
    //             cy.get('input[name="rsl_last_instance"]').should('have.value', 1)
    //         })
    //     })

    //     it('links to next instance (2=>3)', () => {     
            
    //         //  Add instance 1
    //         cy.editRecordFor('repeat_survey_link',1,2)
    //         cy.saveRecord()

    //         //  Check first rsl
    //         cy.editRecordFor('base')
    //         cy.get('input[name="helper_rsl"]').invoke('val').then((rsl) => {
    //             cy.visit(rsl)
    //             cy.get('input[name="rsl_current_instance"]').should('have.value', 3)
    //             cy.get('input[name="rsl_last_instance"]').should('have.value', 2)
    //         })
    //     })

    // })



    /**
     * Export Data Dictionary Changes
     * to do
     * 
     * @since 1.0.0
     */

    /**
     * Address Auto Complete
     * Description: Example implementation of Ontology Provider add in 8.8.1. 
     * This module allows a site wide set of code/displays to defined and then referenced as an ontology.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
     context('Address Auto Complete', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Address Auto Complete')

            //  Set advanced_save = false in module configuration
            cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('tr[data-module="address_auto_complete"]').find('.external-modules-configure-button').click()
            cy.get('#external-modules-configure-modal').should('be.visible')
            cy.get('input[name="enable-advanced-save"]').should('be.visible').uncheck({force:true})
            cy.saveModuleConfig()
        })

        it('auto completes on Data Entry Page simple.', () => {
           
            cy.editRecordFor('address_auto_complete')
            cy.get('#address-auto-complete-aac_field_1').type('Kreuzstrasse 2, 4123');
            cy.get('ul.ui-autocomplete').find('li.ui-menu-item .ui-menu-item-wrapper').first().click()

            cy.get('input[name="aac_meta_1"]').should(($meta) => {
                expect($meta.val()).to.contain('245068214_0')
            });
        })

        it('auto completes on Survey Page simple', () => {
            //  Logout + Open Survey
            cy.get('input[name="aac_survey_url"]').invoke('val').then( (aac_survey_url) => {
                cy.logout()
                cy.visit(aac_survey_url)
                cy.get('#address-auto-complete-aac_field_1').type('Kreuzstrasse 2, 4123');
                cy.get('ul.ui-autocomplete').find('li.ui-menu-item .ui-menu-item-wrapper').first().click()
                cy.get('input[name="aac_meta_1"]').should('contain.value', '245068214_0')
            })
        })

        it('auto completes on Data Entry Page advanced.', () => {
            
            cy.login()
            //  Set advanced_save = true in module configuration
            cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('tr[data-module="address_auto_complete"]').find('.external-modules-configure-button').click()
            cy.get('#external-modules-configure-modal').should('be.visible')
            cy.get('input[name="enable-advanced-save"]').check({force:true})
            cy.get('#external-modules-configure-modal').find('.modal-footer button.save').click()

            cy.editRecordFor('address_auto_complete')
            cy.get('#address-auto-complete-aac_field_1').type('Kreuzstrasse 2, 4123');
            cy.get('ul.ui-autocomplete').find('li.ui-menu-item .ui-menu-item-wrapper').first().click()
            
            cy.get('input[name="aac_meta_1"]').should('contain.value', '245068214_0')
            cy.get('input[name="aac_street_1"]').should('have.value', 'Kreuzstrasse')
            cy.get('input[name="aac_number_1"]').should('have.value', '2')
            cy.get('input[name="aac_code_1"]').should('have.value', '4123')
            cy.get('input[name="aac_city_1"]').should('have.value', 'Allschwil')
        })

        it('auto completes on Survey Page advanced.', () => {
            //  Logout + Open Survey
            cy.get('input[name="aac_survey_url"]').invoke('val').then( (aac_survey_url) => {
                cy.logout()
                cy.visit(aac_survey_url)
                cy.get('#address-auto-complete-aac_field_1').type('Kreuzstrasse 2, 4123');
                cy.get('ul.ui-autocomplete').find('li.ui-menu-item .ui-menu-item-wrapper').first().click()
                
                cy.get('input[name="aac_meta_1"]').should('contain.value', '245068214_0')
                cy.get('input[name="aac_street_1"]').should('have.value', 'Kreuzstrasse')
                cy.get('input[name="aac_number_1"]').should('have.value', '2')
                cy.get('input[name="aac_code_1"]').should('have.value', '4123')
                cy.get('input[name="aac_city_1"]').should('have.value', 'Allschwil')
            })
            cy.login()
        })

        it('can input Custom Address', () => {
            //  Presumes that "Custom Address" is enabled
            cy.editRecordFor('address_auto_complete')
            cy.get('#address-auto-complete-aac_field_1').type('foobar')
            cy.get('#aac-status-aac_field_1').should('contain.text', 'Nothing found.')
            cy.get('#aac-custom-address-btn-aac_field_1').should('be.visible').click()
            cy.wait(1500)
            cy.get('#custom-address-modal').should('be.visible')
            cy.wait(500)
            //  Presumes that advanced save is enabled
            cy.get('input#custom-street').type('custom street')            
            cy.get('input#custom-number').type('custom number')
            cy.get('input#custom-city').type('custom city')
            cy.get('input#custom-code').type('custom code')
            cy.get('input#custom-country').type('custom country')
            cy.get('input#custom-note').type('custom note')

            cy.get('#custom-address-form .modal-footer .btn-primary').click()

            cy.get('input[name="aac_meta_1"]').should('have.value', '')
            cy.get('input[name="aac_street_1"]').should('have.value', 'custom street')
            cy.get('input[name="aac_number_1"]').should('have.value', 'custom number')
            cy.get('input[name="aac_code_1"]').should('have.value', 'custom code')
            cy.get('input[name="aac_city_1"]').should('have.value', 'custom city')
            cy.get('input[name="aac_country_1"]').should('have.value', 'custom country')
            cy.get('input[name="aac_note_1"]').should('have.value', 'custom note')

        })
    })

    /**
     * Record Home Dashboard
     * todo
     * 
     * @since 1.0.0
     */
    context('Record Home Dashboard', () => {
        it('is enabled', () => {
            cy.moduleIsEnabled('Record Home Dashboard')
        })

        //  Editor Tests

        //  Fixture
        //  Create Dashboard Items

        it('has editor accesible', () => {
            cy.visit(path_redcap + '/ExternalModules/?prefix=record_home_dashboard&page=editor&pid=' + data_em.em_test_pid)
            cy.get('#content-empty').should('be.visible')
        }) 

        it('creates rows', () => {
            //  create 2 rows
            cy.get('#content-empty').click()
            cy.get('.editor-row').should('have.length', 1)

            cy.get('.add-row-area').click()
            cy.get('.editor-row').should('have.length', 2)
        })

        
        it('creates columns', () => {
            //  create 3 columns in first row
            cy.get('div.editor-row:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
            cy.get('div.editor-row:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
            cy.get('div.editor-row:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()

            cy.get('.editor-column').should('have.length', 3)
        })

        it('creates element text', () => {

            //  Create text element in first row and first column
            cy.get('div.editor-column:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
            cy.get('div.modal-content').should('be.visible')
            cy.get('div.modal-content input[type="text"]').type("Foo")
            cy.get('footer.modal-footer .btn-info').click()

            //  should
        } )

        it('creates element link', () => {
            //  Create link element in first row and first column
            cy.get('div.editor-column:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
            cy.get('div.modal-body label.btn-outline-secondary:nth-child(2)').click()
            cy.get('div.modal-content fieldset:nth-child(1) input[type="text"]').type("Bar")
            cy.get('div.modal-content fieldset:nth-child(2) input[type="text"]').type("https://foo.bar")
            cy.get('footer.modal-footer .btn-info').click()
            
            //  should
        })

        it('creates element list', () => {
            //  Create list element in first row and second column
            cy.get('div.editor-column:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
            cy.get('div.modal-body label.btn-outline-secondary:nth-child(3)').click()
            //  Add 3 list rows to list element
            cy.get('.modal-body > div:nth-child(2) > div > div > div > button').click()
            cy.get('.modal-body > div:nth-child(2) > div > div > div > button').click()
            cy.get('.modal-body li').should('have.length', 3)
            //  Add list content
            cy.get('li:nth-child(1) input.list-element-input:nth-child(2)').type("Foo 1")
            cy.get('li:nth-child(1) input.list-element-input:nth-child(3)').type("[foo1]")
            cy.get('li:nth-child(2) input.list-element-input:nth-child(2)').type("Foo 2")
            cy.get('li:nth-child(2) input.list-element-input:nth-child(3)').type("[foo2]")
            cy.get('li:nth-child(3) input.list-element-input:nth-child(2)').type("Foo 3")
            cy.get('li:nth-child(3) input.list-element-input:nth-child(3)').type("[foo3]")
            cy.get('footer.modal-footer .btn-info').click()

            //  should
        })

        it('creates element table', () => {
            //  Create table element in second row
            cy.get('div.editor-row:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
            cy.get('div.editor-row:nth-child(2) >div:nth-child(2) > div:nth-child(1)  > div:nth-child(1) > div .editor-row-menu button:nth-child(1)').click()
            cy.get('div.modal-body label.btn-outline-secondary:nth-child(4)').click()
            cy.get('div.modal-body select.custom-select').select('record_home_dashboard', {force:true}).should("have.value", "record_home_dashboard")
            cy.get('footer.modal-footer .btn-info').click()

            //  should
        })

        //  Render Tests

        it('shows Dashboard wrapper', () => {
            cy.visitRecordHomePage()

            //  Add record first
            //cy.visit(path_redcap + '/DataEntry/index.php?page=record_home_dashboard&id=1&pid='  + data_em.em_test_pid)
            cy.editRecordFor('record_home_dashboard')
            cy.get('input[name="foo1"]').type("Bar 1")
            cy.get('input[name="foo2"]').type("Bar 2")
            cy.saveRecord()

            //  Check 
            cy.get('#STPH_DASHBOARD_WRAPPER').should('be.visible')
        })

        it('shows Dashboard title', () => {
            cy.get('#record_home_dashboard_title').contains('Record Home Dashboard')
        })

        it('shows element text', () => {
            cy.get('#STPH_DASHBOARD_WRAPPER .row:nth-child(1) .col:nth-child(1) div h2').contains("Foo")
        })

        it('shows element link', () => {
            cy.get('#STPH_DASHBOARD_WRAPPER .row:nth-child(1) .col:nth-child(1) div a').should(($a) => {
                expect($a).to.contain("Bar")
                expect($a).to.have.attr("href", "https://foo.bar")
                expect($a).to.have.attr("target", "_self")
                expect($a).to.have.class("btn-info")
            })
        })
        
        it('shows element list', () => {            
            cy.get('#STPH_DASHBOARD_WRAPPER .row:nth-child(1) .col:nth-child(2) div.list-group').should(($list)=> {
                
                const $all = $list.find("div")
                expect($all).to.have.length(3)

                const $first = $all.first().find("span")
                expect($first).to.contain("Bar 1")

                const $second = $all.next().find("span")
                expect($second).to.contain("Bar 2")

                const $third = $all.next().find("span")
                expect($third).to.contain("Foo")
            })
        })

        xit('shows element table', () => {
            cy.get('#STPH_DASHBOARD_WRAPPER .row:nth-child(2) .col:nth-child(1) table').should(($table) => {
                expect($table).to.have.attr("aria-colcount", 3)

                expect($table.find("thead tr:nth-child(1) th:nth-child(1) div")).to.contain("foo1")
                expect($table.find("thead tr:nth-child(1) th:nth-child(2) div")).to.contain("foo2")
                expect($table.find("thead tr:nth-child(1) th:nth-child(3) div")).to.contain("foo3")

                expect($table.find("tbody tr:nth-child(1) td:nth-child(1) span")).to.contain("Bar 1")
                expect($table.find("tbody tr:nth-child(1) td:nth-child(2) span")).to.contain("Bar 2")
                expect($table.find("tbody tr:nth-child(1) td:nth-child(3) span")).to.contain("Foo")
            })
        })

        it('exports', () => {

            cy.visit(path_redcap + '/ExternalModules/?prefix=record_home_dashboard&page=editor&pid=' + data_em.em_test_pid)

            //  Trigger Export
            cy.get('div.dropdown .btn').click()
            cy.get('.dropdown-menu-right >li:nth-child(2) a').click()
            cy.get('footer.modal-footer button.btn-primary').click()         
            
            //  Get filename
            const downloadsFolder = Cypress.config("downloadsFolder")
            cy.task('readDir', {__dirname: downloadsFolder}).then((files) => {

                const _fileLocal = "record_home_dashboard_export.json"
                
                //  find by pattern
                const _fileDownl = files.filter((allFilesPaths) => allFilesPaths.match(/record_home_dashboard_.*\.json$/) !== null)[0]

                if(_fileDownl) {
                    //  compare JSON deeply
                    cy.compareFiles(_fileLocal, _fileDownl, true)
                } else {
                    console.log("Error during file download.")
                }


            })

        })

        it('imports', () => {
            
            cy.visit(path_redcap + '/ExternalModules/?prefix=record_home_dashboard&page=editor&pid=' + data_em.em_test_pid)

            cy.get('div.dropdown .btn').click()
            cy.get('.dropdown-menu-right >li:nth-child(1) a').click()
            cy.get('#import-modal___BV_modal_content_ input.custom-file-input').selectFile('cypress/fixtures/record_home_dashboard_import.json', {force: true})
            cy.get('footer.modal-footer button.btn-primary').click()

            //  Check editor changes
            cy.get('.editor-row').should('have.length', 1)
            cy.get('.editor-column').should('have.length', 1)
            cy.get('div.editor-column .card-body .card').should('have.length', 1)
            cy.get('div.editor-column .card-body .card .card-body span.badge').contains("text")
        })
        
        it('resets', () => {
            cy.visit(path_redcap + '/ExternalModules/?prefix=record_home_dashboard&page=editor&pid=' + data_em.em_test_pid)

            cy.get('div.dropdown .btn').click()
            cy.get('.dropdown-menu-right >li:nth-child(4) a').click()
            cy.get('footer.modal-footer button.btn-danger').click()

            //  Check editor changes
            cy.get('.editor-wrapper #content-empty').should("exist").and("be.visible")

        })

    })


    /**
     * Add Instance on Save
     * Add new instance to a record of a repeating instance by saving any field on any project. 
     * Additionally, define piping fields to set the initial values of fields within the newly added instance.
     * 
     * PHP81
     * 
     * @since 1.0.0    
     */
     context('Add Instance on Save', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Add Instance on Save')

            //  Test fixtures

            //  Reset record=1 from cross-testing-project and add clean record to be in sync with #test EM project
            cy.deleteRecord(1, data_em.cross_test_pid)
            cy.editRecordFor('base',1,1, data_em.cross_test_pid)
            cy.saveRecord()

            //  Reset record=2 from cross-testing-project and add clean record to be in sync with #test EM project
            cy.deleteRecord(2, data_em.cross_test_pid)
            cy.editRecordFor('base',2,1, data_em.cross_test_pid)
            cy.saveRecord()
        })

        it('triggers AIOS in data entry mode', () => {
            //  Trigger AIOS
            cy.editRecordFor('base')
            cy.get('input[name="helper_aios"]').clear().type('test-aios-input')
            cy.saveRecord()
        })

        it('add first instance on save in same project', () => {
            cy.editRecordFor('add_instance_on_save',1,1)
            cy.get('input[name="aios_current_instance"]').should('have.value', 1)
            cy.get('input[name="aios_pipe_target"]').should('have.value', 'test-aios-input')
        })

        it('add first instance on save in cross project', () => {
            cy.editRecordFor('add_instance_on_save',1,1, data_em.cross_test_pid)
            cy.get('input[name="aios_current_instance"]').should('have.value', 1)
            cy.get('input[name="aios_pipe_target"]').should('have.value', 'test-aios-input')
        })


        it('triggers AIOS in survey mode', () => {

            cy.editRecordFor('survey',2)
            cy.get('#submit-btn-savecontinue').click()

            cy.get('input[name="survey_url"]').invoke('val').then( (survey_url) => {
                cy.logout()
                cy.visit(survey_url)
            })

            cy.get('input[name="survey_helper_aios"').clear().type('test-aios-survey-input')
            cy.submitSurvey()
            cy.login()
        })

        it('add first instance on submit in same project', () => {
            cy.editRecordFor('add_instance_on_save',2,1)
            cy.get('input[name="aios_current_instance"]').should('have.value', 1)
            cy.get('input[name="aios_pipe_target"]').should('have.value', 'test-aios-survey-input')
        })

        it('add first instance on submit in cross project', () => {
            cy.editRecordFor('add_instance_on_save',2,1, data_em.cross_test_pid)
            cy.get('input[name="aios_current_instance"]').should('have.value', 1)
            cy.get('input[name="aios_pipe_target"]').should('have.value', 'test-aios-survey-input')
        })
        



    })


    /**
     * Cross-Project Piping
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Cross-Project Piping', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Cross-Project Piping')

        })

        it('pipes all records on button click', () => {
            //  Reset EM project
            cy.deleteRecord(1)
            cy.editRecordFor('base')
            cy.saveRecord()

            //  Reset Cross Project
            cy.deleteRecord(1, data_em.cross_test_pid)
            cy.editRecordFor('crossproject_piping',1,1, data_em.cross_test_pid)

            //  Trigger CCP
            cy.get('input[name="ccp_source"]').type('foo-cpp')
            cy.saveRecord()
            cy.visit(path_redcap + '/DataEntry/record_status_dashboard.php?pid=' + data_em.em_test_pid)
            cy.get('#pipe_all_records').click()

            //  Check piping
            cy.editRecordFor('crossproject_piping')
            cy.get('input[name="cpp_target"]').should('have.value', 'foo-cpp')
        })

    })

    /**
     * 
     * Date Calculated Fields
     * Allows for piping from date fields to other date fields, regardless of format. 
     * Can pipe data across events within a REDCap project.
     * 
     * PHP81
     * 
     * @since 1.0.0
     */
    context('Date Calculated Fields', () => {

        it('is enabled', () => {
            cy.moduleIsEnabled('Date Calculated Fields')
            cy.editRecordFor('date_calculated_fields')
            cy.get('input[name="dcf_source"]').type('13-05-2022')
            cy.get('body').click(0,0)
        })

        it('adds 1 day', () => {
            cy.get('input[name="dcf_target_1"]').should('have.value', '13-05-2022')
        })

        it('adds 1 month', () => {
            cy.get('input[name="dcf_target_2"]').should('have.value', '12-06-2022')
        })
    }) 



})

