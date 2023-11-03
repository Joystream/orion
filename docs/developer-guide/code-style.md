# Code style

We're using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to ensure good quality of the code and consistent formatting across the codebase.

We rely on [GitHub workflows](https://docs.github.com/en/actions/using-workflows/about-workflows) like [this one](../../.github/workflows/checks.yml) to make sure the code is linted and formatted according to the ESLint and Prettier rules when a new pull request is opened.

To make sure your code is always properly formatted and linted you can:
- Run `npm run lint --fix && npm run format && git add .` before committing your changes and pushing them to GitHub.
- Add an extension to your IDE which will automatically lint and format your code upon saving a file (see: [VSCode extension](#vscode-extension)).
- Run `npm run checks` to make sure your pull request will pass the linting & formatting check.

## VSCode extension

If you're using VSCode as your IDE, you can install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension and configure it to automatically format and lint the code for you each time you save a file inside the Orion workspace.

Once you install the extension you can add following config to the `.vscode/settings.json` file inside the Orion workspace:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
