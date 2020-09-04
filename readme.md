# @webdeveric/sync-package-version

## Install

```shell
npm i webdeveric/sync-package-version -D
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
