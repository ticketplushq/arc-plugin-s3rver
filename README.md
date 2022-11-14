# @ticketplushq/arc-plugin-s3rver

[![Build](https://github.com/ticketplushq/arc-plugin-s3rver/actions/workflows/build.yaml/badge.svg)](https://github.com/ticketplushq/arc-plugin-s3rver/actions/workflows/build.yaml)

This plugin runs an s3 server (thanks to [s3rver](https://www.npmjs.com/package/s3rver)) in the architect sandbox. With it you can develop and run tests that depend on S3.

## Table of contents

- [Install](#install)
- [Usage](#usage)
  - [The `@s3rver` pragma](#the-s3rver-pragma)
  - [Accessing to your buckets](#accessing-to-your-buckets)
- [Contributing](#contributing)
- [License](#license)

## Install

`npm i @ticketplushq/arc-plugin-s3rver`

Add this line to your Architect project manifest:

```arc
# app.arc
@plugins
ticketplushq/arc-plugin-s3rver
```

Then follow the directions below for `@s3rver`.

## Usage

### The `@s3rver` pragma

The `@s3rver` pragma allows you to configure [s3rver](https://www.npmjs.com/package/s3rver). This is not really necessary, but if you want to change something, this is the way:

- The `buckets` entry allow you to define any custom bucket
  * By default, this plugin automatically configure buckets from [`@architect/plugin-storage-private`](https://github.com/architect/plugin-storage-private) and [`@architect/plugin-storage-public`](https://github.com/architect/plugin-storage-public)
- The `options` entry correspond to s3rver options

#### Example

```
@s3rver
buckets
  my-custom-bucket
  another-bucket
options
  port 4569
```

### Accessing to your buckets

To get the name of the buckets, this plugin enable env vars on testing environment following the [`@architect/plugin-storage-private`](https://github.com/architect/plugin-storage-private) and [`@architect/plugin-storage-public`](https://github.com/architect/plugin-storage-public) conventions. In case you don't know, this mean a `ARC_STORAGE_PRIVATE_<bucketname>` env var (with any dashes converted to underscores), or in case of public bucket `ARC_STORAGE_PUBLIC_<bucketname>`.

Notice that, for custom buckets we don't create anything, because you probably have your own way to handle it.

In addition to that, we also have a handy `ARC_S3RVER_CONFIG` env var, which has the settings (in JSON) to connect to the local s3 server.

#### Example

```arc
@app
my-app

@plugins
ticketplushq/arc-plugin-s3rver

@storage-public
no-sensitive-data
```

Then, you can access to your bucket using the following example script:

```js
import { S3 } from 'aws-sdk'

const s3Config = JSON.parse(process.env.ARC_S3RVER_CONFIG || '{}')
const Bucket = process.env.ARC_STORAGE_PUBLIC_NO_SENSITIVE_DATA

const s3 = new S3(s3Config)
const Body = 'something'
const Key = 'path/to/something'
s3.upload({ Bucket, Key, Body }).promise().then(() => console.log('congrats!'))
```

## Maintainer

[@ticketplushq](https://github.com/ticketplushq)

## Contributing

Feel free to dive in! Open an issue or submit PRs.

## License

Apache License 2.0 © 2022 Ticketplus
