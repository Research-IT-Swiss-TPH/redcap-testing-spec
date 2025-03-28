# redcap-testing-spec
Cypress testing specification for REDCap External Modules test.

> [!WARNING]
> This code base is outdated and uses Cypress v10.11.0. Upgrading to a newer Cypress version will break the tests. Breaking changes are present in cookie handling and authentication flow. However, to sustain the automated testing it is **highly recommended** to update the testing specification to a newer version of Cypress.

## Requirements

- Node.js: v18.8.0
- npm: 8.18.0

> [!TIP]
> Use a node version manager like fnm or nvm to setup your development environment easily.

## Setup

Clone repository:
```bash
git clone https://github.com/tertek/redcap-testing-spec.git
cd redcap-dev-spec
```

Install npm dependencies and Cypress client:
```bash
npm install
.\node_modules\.bin\cypress install
```

## Configure

Create Cypress Config `cypress.env.json`,
for example:
```json
{
    "environment": "local",
    "version": "13.1.32",

    "user_local": "username",
    "pass_local": "password",
    "apik_local": "api-token",


}
```
The configuration is used to control how Cypress connects to the target and authenticates if required.

- environment: Defines what path in `/data/` should be taken and sets the global variables from `/data/<environment>/external_modules.json`. This must be either `local | dev | prod`.

- version: This is a security measure that ensures that you only run tests on environments that have the specified version of REDCap installed. Must be the exact REDCap version number format.

The credentials are used to login to the specific REDCap instance and have the environment as a suffix to the variable's key.


Ensure required permissions are set within project directory:
- Directory /cypress/downloads needs to be writable
- Directory /cypress/fixtures needs to be readable

## Usage

### General Cypress Usage
Note: The repo has pre-formated npm scripts that have been adjusted to run with the Swiss TPH environments. See below.

Open in Cypress Client:
```bash
.\node_modules\.bin\cypress open
```

Headless with calling reports::
```bash
.\node_modules\.bin\cypress run
```

### Pre-formated usage
See package.json `scripts` for details.

Run local:

```bash
npm run local
# Connects to default baseUrl=redcap-local.test that is setup in cypress.confic.js
```

Run dev:

```bash
npm run dev
# Connects to baseUrl=redcap-dev.swisstph.ch
```

Run prod:

```bash
npm run prod
# Connects to default baseUrl=redcap.swisstph.ch
```

## Reports

After running Cypress Tests in headless mode, a html report will be generated and saved in `cypress\reports`. Report settings can be adjusted in `cypress.config.js`.

## Testing Projects

You can find testing project and EM data in `/redcap`. For a detailed instruction on how to setup testing projects see the PDF `redcap/Testing Project Setup.pdf`.

## Troublshooting

Adding `:open` to npm script commands will open Cypress in headed that helps debugging.


In case of errors, clear cache:
```bash
.\node_modules\.bin\cypress cache clear
```

