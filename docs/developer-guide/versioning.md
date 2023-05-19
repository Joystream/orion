# Versioning

We generally follow [Semantic Versioning](https://semver.org/) for [our releases](./tutorials/releasing.md). This means that:
- **Major** version changes (e.g. `1.0.0` -> `2.0.0`) are reserved for breaking changes.
- **Minor** version changes (e.g. `1.0.0` -> `1.1.0`) are reserved for new features and non-breaking changes.
- **Patch** version changes (e.g. `1.0.0` -> `1.0.1`) are reserved for non-breaking bug fixes.

## Releases

Each time there is a new release (ie. a production instance of Orion is being updated):
- The Orion version has to be updated in [`package.json`](../../package.json) and [`package-lock.json`](../../package-lock.json).
- A new entry has to be added to the [CHANGELOG](../../CHANGELOG.md), describing all the changes made since the last release.
- A new tag has to be created in the GitHub repository. The tag should match the version specified in [`package.json`](../../package.json) (for example: `2.3.0`)

For more details about releasing Orion, see _[Releasing guide](./tutorials/releasing.md)_.