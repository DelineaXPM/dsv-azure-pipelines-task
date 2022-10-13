# Azure DevOps Delinea DevOps Secret vault plugin for secure secrets retrieval in Azure Pipelines

This repository contains the code for an Azure DevOps pipeline task which is used to read secrets from Delinea DevOps Secrets Vault.

## Getting Started

- [Developer](DEVELOPER.md): instructions on running tests, local tooling, and other resources.
- [DSV Documentation](https://docs.delinea.com/dsv/current?ref=githubrepo)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org)
- [TypeScript Compiler](https://www.npmjs.com/package/typescript)
- CLI for Azure DevOps (tfx-cli) to package the extension. You can install _tfx-cli_ by running _npm i -g tfx-cli_.

## Setup

> Optional: GithHub Codespaces/Devcontainer included in project for automated setup.

- Run `aqua install` for tooling such as `changie` or others for the project.
  - If you want to install those manually, you can see list of tools in `aqua.yml`.
- Run `mage init` to install tooling.
- Install [trunk](https://trunk.io/products/check) (quick install script: `curl https://get.trunk.io -fsSL | bash`)
- Install [aqua](https://aquaproj.github.io/docs/tutorial-basics/quick-start#install-aqua) and have it configured in your path per directions.
  - This will allow faster installs of project tooling by grabbing binaries for your platform more quickly (most of the time release binaries instead of building from source).

## Important

Releases are driven from the changelog, which should be updated via `changie` as part of any PR.
This will be merged into the final changelog and trigger a release when it's needed.

Focus on summarizing the end result, as `git log` covers the incremental details.

## General

The task code can be found in the **dsv** directory.
The entry point for the task is _index.ts_ and most of the core code can be found in _operations/Vault.ts_.

## Compiling

From the task directory **dsv**, first install the task dependencies:

```bash
npm install
```

Then to compile the task:

```bash
dsv> tsc
```

## Debugging

Create a _launch.json_ in your **.vscode** directory:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}\\DSVV1\\index.ts",
      "outFiles": ["${workspaceFolder}/**/*.js"],
      "env": {
        "INPUT_CLIENTID": "93d866d4-635f-4d4e-9ce3-0ef7f879f319",
        "INPUT_CLIENTSECRET": "xxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxx-xxxxx",
        "INPUT_SERVERURL": "https://mytenent.secretsvaultcloud.com/v1/",
        "INPUT_SECRETPATH": "/valid/secret",
        "INPUT_DATAFILTER": "*",
        "INPUT_VARIABLEPREFIX": "DSV_"
      }
    }
  ]
}
```

From the 'Run' menu, select 'Start Debugging' OR F5.

## Unit Tests

Create a _success_config.json_ in the **dsv/tests** directory:

```json
{
  "credentials": {
    "clientId": "93d866d4-635f-4d4e-9ce3-0ef7f879f319",
    "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxx-xxxxx"
  },
  "serverUrl": "https://mytenant.secretsvaultcloud.com/v1/",
  "secretPath": "/valid/secret",
  "dataFilter": "*",
  "variablePrefix": "DSV_"
}
```

Create a _failure_config.json_ in the **dsv/tests** directory:

```json
{
  "credentials": {
    "clientId": "93d866d4-635f-4d4e-9ce3-0ef7f879f319",
    "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxx-xxxxx"
  },
  "serverUrl": "https://mytenant.secretsvaultcloud.com/v1/",
  "secretPath": "/invalid/secret",
  "dataFilter": "*",
  "variablePrefix": "DSV_"
}
```

From the task directory **dsv**, run the following:

```bash
dsv> mocha ./tests/_suite.js
```

# Packaging the extension

Package the extension into a .vsix file using the following command from the repository root:

```bash
> tfx extension create --manifest-globs vss-extension.json
```

Note, the version in _vss-extension.json_ must match the one in _dsv/task.json_.
