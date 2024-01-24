# redcap-dev-spec
Cypress project for redcap testing:

- system config
- em config
- (projects)


## Setup

Clone repository:
`git clone https://github.com/tertek/redcap-dev-spec.git`
`cd redcap-dev-spec`

Install npm dependencies:
`npm install`

Install Cypress Client:
`.\node_modules\.bin\cypress install`

## Configure

Create Cypress Config `cypress.env.json`,
for example:
```json
{
    "environment": "local",
    "version": "13.1.32",
    "username": "username",
    "password": "password"
}
```

## 

How to use


Open in Cypress Client:
`.\node_modules\.bin\cypress open`

Headless with calling reports:
`.\node_modules\.bin\cypress run`

In case of errors, clear cache with:
`.\node_modules\.bin\cypress cache clear`


Permissions:

Directory /cypress/downloads needs to be writable
Directory /cypress/fixtures needs to be readable
