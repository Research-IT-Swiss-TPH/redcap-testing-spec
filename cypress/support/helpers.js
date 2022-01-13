/**
 * A collection of helper functions
 * 
 */

cy.helpers = {
    getRandomString:(length) => {
        return Math.random().toString(36).substr(2,length).split("").map(e=>Math.random()<Math.random()?e.toUpperCase():e).join().replaceAll(",","");
    }
}