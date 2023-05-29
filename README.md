# AudioIgniter - WordPress Plugin
Audio player for WordPress

## Development
Development must be made in short-lived branches. When a feature is complete, its branch should be merged into `main` and get deleted. The `main` branch should remain stable at all times.

Install [nvm](https://github.com/nvm-sh/nvm) and [yarn](https://yarnpkg.com/getting-started/install) on your machine.

While developing, inside the plugin folder run:
```
cd player
nvm use
yarn
yarn start
```

## Build
Run `yarn build` before releasing an update.

## Updating readme.txt without releasing a new version
While it's technically possible, we don't support updating the readme.txt file via Gitgub as it requires a separate long-lived `develop` branch.
Therefore, immediate updates to only the plugin's readme.txt file should be done via Subversion.

## Releasing new versions to WP.org
Before releasing a new version (e.g. **1.0.2**), make sure `main` is ready to be released. This includes:
- Make sure files inside the `build` folder are ready for release. Open them and check they are minified. If not, run the build step above.
- In `audioigniter.php` the plugin header `Version:` number is set to 1.0.2
- The language file `languages/audioigniter.pot` has been updated, if needed.
- The `readme.txt` file has:
  - **Tested up to:** is set to the latest WordPress version.
  - **Stable tag:** is set to 1.0.2
  - A **changelog** entry for 1.0.2 has been created at the bottom of the file.

Then we need to create a [new Release](https://github.com/cssigniter/audioigniter/releases/new).
- **Choose a tag:** Type in the exact new version number without a `v`, i.e. `1.0.2`, and click on the `+ Create new tag: 1.0.2 on publish`
- **Release title:** Type in the exact new version number without a `v`.
- **Target:** Normally should be `main`, unless we need to release a hotfix off of a branch.
- **Description:** The release's changelog.
- **Publish release:** Upon publishing a release, a Github action will run which will:
  - Release the plugin in wp.org
  - Generate a zip file and attach it to the newly created release.
