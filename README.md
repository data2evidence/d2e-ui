# ALP UI

## Inital set up

- Prepare your own Github Personal Access Token (classic). 
- Ensure that it has `read:packages` scope. See [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)
- Create an environment variable in `.zshrc`
```
export GITHUB_TOKEN=<GITHUB_PERSONAL_ACCESS_TOKEN>
```
- Run `source ~/.zshrc` to refresh `.zshrc` file. 
- Run `yarn` in `alp-ui` to install node-modules

## Portal (alp-ui/apps/portal)

### Local development setup

- Copy contents of `.env.example` to a new `.env` file in the `/apps/portal` directory
- Ensure you have required tenant settings and feature flags
  - Tenant Settings: `https://localhost:41000/superadmin/config` > `System Overview` > `Tenant Overview` > `Settings` for desired tenant > choose and save the settings
  - Feature Flags: Ensure `REACT_APP_PLUGINS` in `.env` is uncommented to show plugins on the portal UI
- Run `nx build vue-mri` to build patient analytics used by portal
- Run `nx build jobs` to build log viewer used by jobs plugin in portal
- Run `nx build @portal/plugin` to build libs used by portal
- Run `nx build @portal/components` to build components used by portal
- Run `nx start portal` to start portal, and visit `https://localhost:4000/portal`

## Superadmin (alp-ui/apps/superadmin)

### Local development setup

- Copy contents of `.env.example` to a new `.env` file in the `/apps/superadmin` directory
- Run `nx build jobs` to build log viewer used by jobs plugin in portal
- Run `nx build @portal/plugin` to build libs used by superadmin
- Run `nx start superadmin` to start superadmin, and visit `https://localhost:4100/superadmin`

## Patient Analytics (alp-ui/apps/vue-mri-ui-lib)

### Local development setup

- For developing Patient Analytics, run `nx serve vue-mri`, and visit `https://localhost:8081`

Note:

- When accessing via `https://localhost:41100/portal`, the PA UI files is served from CDN (DEV)
- When accessing via `https://localhost:4000/portal`, the PA UI files is served from local built-files under `alp-ui/resources/mri`

- For developing log viewer, run `nx dev jobs`, and visit `https://localhost:5173/`

## PYQE / Starboard Notebookpsave

### Local development setup for testing new PYQE package

- Create a new folder named `starboard-notebook-base` in `resources`
- Ensure node modules are installed
- Copy contents of `node_modules/@alp-os/alp-starboard-notebook/packages/starboard-notebook/dist` to `resources/starboard-notebook-base`
- Copy newly created PYQE package to `resources/starboard-notebook-base`
- In `docker-compose-ui`, uncomment `volumes:` and `- ../alp-ui/resources/starboard-notebook-base:/home/docker/ui-files/starboard-notebook-base`

## Docker Compose

Its possible to run this as a docker container via docker compose. Different options are available.

### 1. Pull the latest docker image from Container Registry
- The head commit of the develop branch on your local is the tag e.g. 
   - `${CONTAINER_REGISTRY}/alp-data-node/alp-local-ui-file-server:c53a2014ca61d601fce09b5d7bc4affa6b096abd`
- Pull the latest develop branch as and when required as per discretion. 
- There could be mismatch between the frontend and backend version, but this saves time in building images.
```
yarn start:ui
```
- yarn script defined in repos:
   - alp-ui
   - alp-clinical-research
   - alp-data-node
- alp-data-node yarn script expects local folder name to be same as repo name and at same level:
   - alp-data-node
   - alp-ui
- **UI images with commit id as tags, older than 14 days will be automatically deleted. Unless no new images are created for develop tag**

### 2. <b>Build docker image on your local</b>
- If you are on a different branch / commit and dont want to pull the image from the container registry
- Setup your private ssh key to the ssh agent
   - Add below snippet in `~/.ssh/config` (Mac) / `/etc/ssh/ssh_config` (Linux) file
      ```
      Host github.com
         ForwardAgent yes
      ```
   - Login with `ssh -T git@github.com`
   - Then add the key to the ssh agent
      For 
         Mac - `ssh-add --apple-use-keychain`
         Linux - `ssh-add <PATH_TO_YOUR_KEY>`
   - Verify if its configured correctly by running the command `ssh-add -L` / `echo $SSH_AUTH_SOCK` and an output must be displayed. It should <b>Not</b> print `The agent has no identities.` / just new line.
   - If you get `Could not open a connection to your authentication agent` message, you may need to run "eval `ssh-agent`" to turn on the agent
- Build Only
```
yarn build:ui
```
- Build & Run
```
yarn build:start:ui
   ```

### Docker Compose Troubleshooting 
#### local `yarn start:ui` fails with error "manifest unknown"
> Error response from daemon: manifest for ${CONTAINER_REGISTRY}/alp-data-node/alp-local-ui-file-server:<random-commit-id> not found: manifest unknown: manifest tagged by "_random-commit-id_" is not found
- this issue generally occurs when the head commit of the alp-ui repo branch does not have a tag in the container registry

Possible causes & solutions:
- your local develop branch is older than 14 days:
   - Try pulling from latest remote develop, if you feel the latest version is compatible with backend version (OR) 
   - Create an own branch from a recent commit in the last 14 days from remote develop branch. This docker image with commit id tag will be available on ACR. 
- You are are on your own feature branch, with your specific commit:
   - Run `build:start:ui` within alp-ui repo, to build the docker image locally for your version
- The latest commit tag for develop branch is building on github actions still:
   - Please wait for 20 minutes to finish build (OR)
   - Hardcode the previous long commit id of develop branch in package.json -> `GIT_HEAD_COMMIT_ALP_UI_REPO=<PREVIOUS-LONG-COMMIT-ID>`

## Plugins

For remote plugin, refer to [this](./plugins/README.md)

For built-in plugin, refer to [this](./apps/portal/src/plugins/README.md)

### Plugins Troubleshooting

- If nx commands do not seem to be working, try `nx clear-cache` and rerun nx commands.