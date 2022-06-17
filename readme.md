# @webdeveric/sync-package-version

[![Build Status](https://travis-ci.org/webdeveric/sync-package-version.svg?branch=master)](https://travis-ci.org/webdeveric/sync-package-version)

## Install

```shell
npm i @webdeveric/sync-package-version -D
```

## Usage

```json
{
  "name": "YOUR-PACKAGE-NAME",
  "version": "1.0.0",
  "scripts": {
    "version": "sync-package-version YOUR-JSON-FILE-HERE | xargs git add"
  }
}
```

You can specify a custom version to use if you don't want the `version` from `package.json`.

```sh
sync-package-version --package-version "custom.version.here" [files...]
```

### Commands

#### `sync` (default)

##### Options

- `--package-version <version>` - Provide your own version number
- `--property-path <path>` - The path to the property in the destination file where you want to store the version number
- `--force` - Force a sync, ignoring destination data type

## Local development

```
npx corepack enable
pnpm install
pnpm build
```
