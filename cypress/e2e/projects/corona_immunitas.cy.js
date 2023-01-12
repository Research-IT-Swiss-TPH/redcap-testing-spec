/**
 * Testing Specification for REDCap project: Corona Immunitas
 * Pre-Requirements:
 * - Project Meta Data exported from redcap.swisstph.ch
 * - Project Meta Data imported into testing environment
 * - Project Module Settings exported from redcap.swisstph.ch
 * - External Modules enabled in testing environment
 * - Project Module Settings imported into testing environment
 * - Ensure that Project data is empty
 * 
 */



/**
 * Critical Scenarios to test
 * 
 * 
 * 
 */

/**
 * Create Test Record with ID 999995
 * 
 */
 cy.visit('https://localhost/redcap/redcap_v12.0.25/DataEntry/record_home.php?pid=18&id=999995&auto=1&arm=1');
 cy.url().should('contains', 'https://localhost/redcap/redcap_v12.0.25/DataEntry/index.php');
 cy.get('.jqbuttonsm > span').click();
 cy.get('.greenhighlight .x-form-text').click();
 cy.get('#pi_last_name-tr .x-form-text').type('Foo');
 cy.get('#pi_first_name-tr .x-form-text').type('Bar');
 cy.get('#opt-pi_sex_0').click();
 cy.get('.greenhighlight .ui-datepicker-trigger').click();
 cy.get('.ui-datepicker-year').click();
 cy.get('.ui-datepicker-year').type('1990');
 cy.get('.ui-datepicker-month').click();
 cy.get('.ui-datepicker-month').type('0');
 cy.get('.ui-state-hover').click();
 cy.get('#\__SUBMITBUTTONS__-div > #submit-btn-saverecord > span').click();
 cy.url().should('contains', 'https://localhost/redcap/redcap_v12.0.25/DataEntry/record_home.php');
 