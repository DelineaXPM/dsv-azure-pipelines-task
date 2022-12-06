# Developer

This document describes how to set up your development environment to build and test Delinea DSV Azure DevOps Task.

Reading the official page ["Add a custom pipelines task extension"][add-build-task] is recommended before you start.

- [Project structure](#project-structure)
- [Local development](#local-development)
- [Changelog](#changelog)
- [Testing](#testing)
- [Debugging in VS Code](#debugging-in-vs-code)
- [Packaging the extension](#packaging-the-extension)

## Project structure

The source code for the task can be found in the **dsv** directory. The entry point for the task is in [index.ts][f1]
and most of the core code can be found in [operations/Vault.ts][f2].

## Local development

This project leverages capabilities of [the aqua project][aqua1] to manage CLI tools. You can follow
the official installation instructions described [here][aqua2] to install the `aqua` command-line tool.

To install tools needed for development run:

```bash
aqua install
```

See [aqua.yaml][f3] for the full list of tools used in the project.

Install [Node.js][1] 18.x (LTS) either manually or using a tool like [fnm][3] (recommended).

Clone this repository. Then open the **dsv** directory in your terminal and install dependencies:

```bash
npm install
```

Run the [TypeScript][2] compiler to compile the task:

```bash
npx tsc
```

## Changelog

Releases are driven from the changelog, which should be updated via `changie` as part of any PR.
This will be merged into the final changelog and trigger a release when it's needed.

Focus on summarizing the end result, as `git log` covers the incremental details.

## Testing

Create a _success_config.json_ in the **dsv/tests** directory:

```json
{
  "credentials": {
    "clientId": "93d866d4-635f-4d4e-9ce3-0ef7f879f319",
    "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxx-xxxxx"
  },
  "serverUrl": "https://mytenant.secretsvaultcloud.com/v1/",
  "secretPath": "valid:secret",
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
  "secretPath": "invalid:secret",
  "dataFilter": "*",
  "variablePrefix": "DSV_"
}
```

From the task directory **dsv**, run the following:

```bash
npm test
```

## Debugging in VS Code

- [Visual Studio Code][4]

Update _launch.json_ in your **.vscode** directory:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/dsv/index.ts",
      "outFiles": ["${workspaceFolder}/**/*.js"],
      "env": {
        "INPUT_CLIENTID": "93d866d4-635f-4d4e-9ce3-0ef7f879f319",
        "INPUT_CLIENTSECRET": "xxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxx-xxxxx",
        "INPUT_SERVERURL": "https://mytenent.secretsvaultcloud.com/v1/",
        "INPUT_SECRETPATH": "valid:secret",
        "INPUT_DATAFILTER": "*",
        "INPUT_VARIABLEPREFIX": "DSV_"
      }
    }
  ]
}
```

From the 'Run' menu, select 'Start Debugging' OR F5.

## Packaging the extension

Make sure that the version in _vss-extension.json_ matches the one in _dsv/task.json_.

The [tfx-cli][5] tool is used to package the extension.

Open the **dsv** directory in your terminal and install dependencies:

```bash
npm install
```

Run the [TypeScript][2] compiler to compile the task:

```bash
npx tsc
```

Remove the packages specified in the devDependencies list from the _node_modules_ directory:

```bash
npm prune --production
```

Go back to root directory of this repository and install _tfx-cli_:

```bash
npm install --global tfx-cli
```

Package the extension into a _.vsix_ file:

```bash
tfx extension create --manifest-globs vss-extension.json
```

## Devcontainer

- Devcontainer configuration included for Codespaces or [Remote Container](https://code.visualstudio.com/docs/remote/containers)

## Run Tasks

Run `trunk fmt --all; trunk check --all` prior to creating pr and you'll have the majority of tests locally validated that would normally require you to wait on github actions to complete.

All other commands can be run via `mage`.

For example test: `mage go:testsum ./...`, or `mage init` to setup.

List all automation tasks via `mage` or `mage -l`, and get more detail when it's available by `mage -h <taskname>`

## Go Vendor

The project is vendored, so anytime you change a dependency: `go mod tidy && go mod vendor` is required.

Do not run `go get -u`, as Renovatebot will automate dependency updates, and create individual PR's per policy to keep things updated.

## Prerequisites For Devcontainer

- Docker
- Visual Studio Code
  - Run `code --install-extension ms-vscode-remote.remote-containers`
  - For supporting Codespaces: `code --install-extension GitHub.codespaces`

## Spin It Up

> **_NOTE_**
>
> 🐎 PERFORMANCE TIP: Using the directions provided for named container volume will optimize performance over trying to just "open in container" as there is no mounting files to your local filesystem.

Use command pallet with vscode (Control+Shift+P or F1) and type to find the command `Remote Containers: Clone Repository in Named Container`.

- Put the git clone url in.

Some extra features are included such as:

- Extensions for VSCode defined in `.devcontainers`, such as Go, Kubernetes & Docker, and some others.
- Initial placeholder `.zshrc` file included to help initialize usage of `direnv` for automatically loading default `.envrc` which contains local developement default environment variables.

### After Devcontainer Loads

1. Accept "Install Recommended Extensions" from popup, to automatically get all the preset tools, and you can choose do this without syncing so it's just for this development environment.
2. Open a new `zsh-login` terminal and allow the automatic setup to finish, as this will ensure all other required tools are setup.
   - Make sure to run `direnv allow` as it prompts you, to ensure all project and your personal environment variables (optional).
3. Run setup task:
   - Using CLI: Run `mage init`

## Troubleshooting

### Mismatch With Checksum for Go Modules

- Run `go clean -modcache && go mod tidy`.

### Connecting to Services Outside of devcontainer

You are in an isolated, self-contained Docker setup.
The ports internally aren't the same as externally in your host OS.
If the port forward isn't discovered automatically, enable it yourself, by using the port forward tab (next to the terminal tab).

1. You should see a port forward once the services are up (next to the terminal button in the bottom pane).
   1. If the click to open url doesn't work, try accessing the path manually, and ensure it is `https`.
      Example: `https://127.0.0.1:9999`

You can choose the external port to access, or even click on it in the tab and it will open in your host for you.

[f1]: dsv/index.ts
[f2]: dsv/operations/Vault.ts
[f3]: aqua.yaml
[aqua1]: https://aquaproj.github.io/
[aqua2]: https://aquaproj.github.io/docs/reference/install
[add-build-task]: https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task
[1]: https://nodejs.org
[2]: https://www.typescriptlang.org/
[3]: https://github.com/Schniz/fnm
[4]: https://code.visualstudio.com/
[5]: https://github.com/microsoft/tfs-cli
