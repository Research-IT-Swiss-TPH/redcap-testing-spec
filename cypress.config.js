const { defineConfig } = require('cypress')
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');  
const exec = require('child_process').execSync;  
const fs = require('fs');
const path = require('path');


module.exports = defineConfig({
  projectId: "zyp8bc",
  experimentalInteractiveRunEvents: true,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    cypressMochawesomeReporterReporterOptions: {
      reportDir: 'cypress/reports',
      charts: true,
      reportPageTitle: 'REDCap Testing PROD',
      embeddedScreenshots: true,
      inlineAssets: true,
      markdown: true
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
    },
  },
  video: false,
  viewportWidth: 1190,
  viewportHeight: 980,
  //  downloadsFolder: /your/custom/path,
  e2e: {
    baseUrl: 'http://redcap-local.test/redcap/',
    specPattern: 'cypress/e2e/*.cy.js',

    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {

      on('task', {
        // deconstruct the individual properties
        hello({ greeting, name }) {
          //console.log('%s, %s', greeting, name)
          return String(greeting + " " + name)
        },

        readDir({__dirname}){
          console.log('\n✅ reading folder %s\n', __dirname)
          const files = fs.readdirSync(__dirname)
          console.log('\n✅ found files %s\n', JSON.stringify(files))
          return files
        },

        deleteFolder({ __dirname }) {
          console.log('\n✅ deleting folder %s\n', __dirname)
          return new Promise((resolve, reject) => {
            if (fs.existsSync(__dirname)) {
              fs.rmdir(__dirname, { maxRetries: 10, recursive: true }, (err) => {
                if (err) {
                  console.error(err)
                  return reject(err)
                }
                resolve(null)
              })
            }
            else {
              resolve(null)
            }

          })
        }

      })

      on('before:run', async (details) => {  
        console.log('override before:run');
        await beforeRunHook(details);  
        //If you are using other than Windows remove below two lines  
        await exec("IF EXIST cypress\\screenshots rmdir /Q /S cypress\\screenshots")  
        await exec("IF EXIST cypress\\reports rmdir /Q /S cypress\\reports")  
      })

      on('after:run', async () => {  
        console.log('override after:run');  
        //if you are using other than Windows remove below line starts with await exec  
        await exec("npx jrm ./cypress/reports/junitreport.xml ./cypress/reports/junit/*.xml");     
        await afterRunHook();  
      })

    },
  },
})
