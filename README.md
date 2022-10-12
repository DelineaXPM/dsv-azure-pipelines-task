# Repo

> **_Warning_**
> Run `find . -type f -name '*.go' -exec sed -i -e 's,github.com/DelineaXPM/dsv-repo-template,github.com/DelineaXPM/MYNEWNAME,g' {} \;` to replace the prior url with the correct one, then run `go mod tidy` to fix.

👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻👉🏻 Do a search and replace for any `dsv-repo-template` existing.

## Getting Started

- [Developer](DEVELOPER.md): instructions on running tests, local tooling, and other resources.
- [DSV Documentation](https://docs.delinea.com/dsv/current?ref=githubrepo)

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

## How This Works
