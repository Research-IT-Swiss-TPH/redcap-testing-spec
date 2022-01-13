//  external_modules.spec.js: Tests all relevant external modules (productive)


//  <Spec Assertion Data>
const data_em = require('../../data/external_modules.json')

//  <paths>
const path_redcap = '/redcap_v' + Cypress.env('version')

describe('Test External Modules', () => {


    /**
     * Auto Record Generation
     * Description: Allows you to create new records in a project (or in the same project) by updating a trigger field. 
     * 
     * Notice: Test can only be repeated if module is configured to overwrite given records
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
         cy.get('#submit-btn-saverecord').click()
        })
 
        it('has auto-generated and filled new record in same project', () => {
         cy.visit(path_redcap + '/DataEntry/index.php?page=auto_record_generation&id=2&pid=' + data_em.em_test_pid)
         cy.get('input[name="trigger_field"]').should('have.value', '')
         cy.get('input[name="auto_filled"]').should('have.value', rndm)
        })
 
     })    

    /**
     * Big Data Import
     * Description: Allows import many records at once through a .csv file upload.
     * Erase before: true
     * Notice: The .csv file is located at ../fixtures/bdi_test_import.csv
     * @since 1.0.0
     */
    context('Big Data Import', ()=>{

        it('is enabled', () =>{

            //  Check if module is enabled
            cy.visit( path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('#external-modules-enabled').should("contain", "Big Data Import")
            //  Remove all previously added records so that we can test properly
            cy.eraseAllData(data_em.em_test_pid)
    
        })

        it('resets module data', () => {
            //  Call directly API
            cy.request({
                url: path_redcap + '/ExternalModules/?prefix=big_data_import&page=resetModuleData&pid=' + data_em.em_test_pid,
              }).then((resp) => {
                // redirect status code is 302
                expect(resp.status).to.eq(200)
                
              })            
        })
    
        it('can upload test csv', () => {
    
            cy.visit(path_redcap + '/ExternalModules/?prefix=big_data_import&page=import&pid=' + data_em.em_test_pid )
    
            cy.fixture('bdi_test_import.csv').then(fileContent => {
                cy.get('input[type="file"]').attachFile({
                    fileContent: fileContent.toString(),
                    fileName: 'bdi_test_import.csv',
                    mimeType: 'text/csv'
                });
            });
    
            cy.get('#import').click()
        });
    
        it('imports data from csv', () => {

            cy.get('#start').click()
            cy.get("div#Msg").should('be.visible')
            cy.contains("Import will start shortly.")
            cy.get('#DataTables_Table_0').contains('Import process finished')
        })


        it('shows successfully imported record', () => {            
            cy.visit( path_redcap + '/DataEntry/index.php?id=100&page=big_data_import&pid='  + data_em.em_test_pid )
            cy.get('input[name="bdi_1"]').should('have.value', 'Foo 100')
            cy.get('input[name="bdi_2"]').should('have.value', 'Bar 100')
            cy.get('input[name="bdi_3"]').should('have.value', 'Car 100')
        })


    })


    /**
     * Complete Row
     * Description: Simple module to highlight filled rows within a form
     * 
     * @since 1.0.0
     */
    context('Complete Row', () => {

        it('is enabled', () => {
            cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('#external-modules-enabled').should("contain", "Complete Row")  
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
     * Mass Delete
     * Description: Allows deletion of a big amount of data at once.
     * 
     * @since 1.0.0
     */
    context('Mass Delete', ()=>{

        it('is enabled', ()=>{
            cy.visit(path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('#external-modules-enabled').should("contain", "Big Data Import")
        })
        
        it('can fetch and select all records', () => {
    
            cy.visit( path_redcap + '/ExternalModules/?prefix=mass_delete&page=page_mass_delete&view=record-list&pid=' + data_em.em_test_pid )
            cy.get('#btn-fetch-records').click()
            cy.get('button[data-choice="all"]').should('be.visible').click()
    
        })

        it('can delete records', () => {
            cy.get('#btn-delete-selection').click()
            cy.get('button.delete_btn').click()
        })
    })




})

