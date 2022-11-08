<p align="center">
  <img src="https://avatars1.githubusercontent.com/u/30219716?s=200&v=4"/>
</p>

# @ticketplushq/arc-plugin-s3rver

Allows to use S3 on sandbox with [s3rver](https://www.npmjs.com/package/s3rver)

## Install

`npm i @ticketplushq/arc-plugin-s3rver`

Add this line to your Architect project manifest:

```arc
# app.arc
@plugins
ticketplushq/arc-plugin-s3rver
```

Then follow the directions below for `@s3rver`.

## `@s3rver`

The `@s3rver` allows to configure `s3rver`.

- The `buckets` entry allow you to define any custom bucket
  - By default this plugin configure buckets from `architect/plugin-storage-private` and `architect/plugin-storage-public`
- The `options` entry is array of options that correspond to s3rver options

## Accessing your bucket names

This plugin enable env vars on testing environment following `architect/plugin-storage-private` and `architect/plugin-storage-public` conventions, and in addition to that, an `ARC_S3RVER_CONFIG` variable, which have the config to connect to the local s3 server.

```arc
@app
my-app

@plugins
ticketplushq/arc-plugin-s3rver

@storage-public
no-sensitive-data
```

Then, you can access to your bucket using de following example script:

```js
import { S3 } from 'aws-sdk'

const s3Config = JSON.parse(process.env.ARC_S3RVER_CONFIG || '{}')
const Bucket = process.env.ARC_STORAGE_PUBLIC_NO_SENSITIVE_DATA

const s3 = new S3(s3Config)
const Body = 'something'
const Key = 'path/to/something'
s3.upload({ Bucket, Key, Body }).promise().then(() => console.log('congrats!'))
```
