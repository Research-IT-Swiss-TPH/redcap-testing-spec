//  external_modules.spec.js: Tests all relevant external modules (productive)


//  <Spec Assertion Data>
const data_em = require('../../data/external_modules.json')

//  <paths>
const path_redcap = '/redcap_v' + Cypress.env('version')

describe('Test External Modules', () => {

    context('Big Data Import', ()=>{

        it('is enabled', () =>{

            //  Check if module is enabled
            cy.visit( path_redcap + '/ExternalModules/manager/project.php?pid=' + data_em.em_test_pid)
            cy.get('#external-modules-enabled').should("contain", "Big Data Import")
    
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
    
        it('does not have records', () =>{  
            //  Check if records are 0 (by checking if first row has colspan == 2)        
            cy.visit( path_redcap + '/DataEntry/record_status_dashboard.php?pid=' + data_em.em_test_pid)
            cy.get('#record_status_table tbody tr td').should("have.attr", "colspan" ,2)
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

    context('Mass Delete', ()=>{

        it("is enabled", ()=>{
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

    //  temporary use of `only` to reduce tests per run
    context.only('Language Editor', () => {
       it("test", () => {
        cy.visit("/")
       })
    })

})

