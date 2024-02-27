/**
 * A collection of helper functions
 * 
 */

//  Set authentication based on environment
let username = Cypress.env('user_'+Cypress.env('environment'))
let password = Cypress.env('pass_'+Cypress.env('environment'))
let api_key = Cypress.env('apik_'+Cypress.env('environment'))


cy.helpers = {
    getRandomString:(length) => {
        return Math.random().toString(36).substr(2,length).split("").map(e=>Math.random()<Math.random()?e.toUpperCase():e).join().replaceAll(",","");
    },
    getUsername:() => {
        return username;
    },
    getPassword: ()=> {
        return password;
    },
    getApiKey: ()=> {
        return api_key;
    },
    getDataPath: () => {
        return '../../data/'+Cypress.env('environment')+'/external_modules.json';
    },
    getVersionPath: () => {
        return '/redcap_v' + Cypress.env('version');
    }

}