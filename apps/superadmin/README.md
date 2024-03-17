# Super Admin UI

Web portal for super admin.

### Technologies

- [React](https://reactjs.org/)
- [D4L web component](https://www.npmjs.com/package/@d4l/web-components-library)
- [Material UI](https://material-ui.com/)
- [MSAL](https://www.npmjs.com/package/msal)


### Install all dependencies

```
yarn
```

### Build

```
yarn build
```

# Built-in Plugin

## How to create a built-in plugin:

- Copy `SuperAdminPage` folder in `apps/superadmin/src/plugins/boilerplates` to `apps/superadmin/src/plugins`.
- Rename the folder name, file name and variables to your new plugin name. E.g. `SuperAdminPage` to `NewPlugin`.
- Update `builtInPlugins.ts` in `apps/portal/src/plugins` to add your new plugin in the moduleNames.
- Update `plugins.json` in root directory:
  ```
  {
    "superadmin": [
      ...
      {
        "name": "New Plugin",
        "route": "new-plugin",
        "pluginPath": "plugins/NewPlugin/module",
        "iconUrl": "icons/system-overview.svg",
        "iconSize": 24,
        "type": "System Overview"
      }
    ]
  }
  ```
- Update `REACT_APP_PLUGINS` in `.env` same as `plugins.json` without carriage-return.
- Run `nx start superadmin` in `alp-ui` folder.
- Go to Super Admin portal to view the plugin.
