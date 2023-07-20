# Patching dependencies

Sometimes you'll need patch one of the Orion npm dependencies. For example, you may want to change the Apollo configuration of Orion's GraphQL server which is spawned by the `@subsquid/graphql-server` dependency.

As a temporary solution, you can use the [`patch-package`](https://www.npmjs.com/package/patch-package) tool (which has already been used to patch a few dependencies in Orion) in order to achieve this.

The way it works is:
1. You modify the dependency's code inside `node_modules` (e.g. `node_modules/@subsquid/graphql-server/lib/server.js`)
2. You run `npx patch-package [PACKAGE_NAME] --patch-dir assets/patches`, where `[PACKAGE_NAME]` is the name of the dependency you want to patch (e.g. `@subsquid/graphql-server`)
3. The `patch-package` tool will create/update a patch file inside `assets/patches` which will apply your changes every time the dependencies are installed (because of the `postinstall` script in `package.json`)