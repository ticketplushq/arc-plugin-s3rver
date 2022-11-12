let test = require('tape')
let { join } = require('path')
let sut = join(process.cwd(), 'src', '_get-s3rver-options')
let getS3rverOptions = require(sut)
let _inventory = require('@architect/inventory')

let correctDefaultOptions = {
  port: 4568,
  accessKeyId: 'S3RVER',
  secretAccessKey: 'S3RVER',
  address: 'localhost',
  directory: './buckets',
  allowMismatchedSignatures: true,
  resetOnClose: true
}

test('Set up env', (t) => {
  t.plan(1)
  t.ok(getS3rverOptions, 's3rver options getter is present')
})

test('Custom bucket names', async (t) => {
  t.plan(2)
  let rawArc = `
@app
app
@s3rver
buckets
  bucket-a
  bucket-b
`
  let correctBucketNames = [ 'bucket-a', 'bucket-b' ]
  let { inv } = await _inventory({ rawArc })
  let arc = inv._project.arc
  let { customBucketNames, options } = getS3rverOptions(arc['s3rver'])
  t.deepEqual(customBucketNames, correctBucketNames, 'Got correct bucket names')
  t.deepEqual(options, correctDefaultOptions, 'Got correct default options')
})

test('Custom s3rver options', async (t) => {
  t.plan(2)
  let rawArc = `
@app
app
@s3rver
options
  address custom.address
  port 12345
  key customKey
  cert customCert
  serviceEndpoint amazonaws.com
  directory custom/directory
  allowMismatchedSignatures true
  vhostBuckets false
  resetOnClose false
  accessKeyId customAccessKeyId
  secretAccessKey customSecretAccessKey
`
  let correctOptions = {
    port: 12345,
    accessKeyId: 'customAccessKeyId',
    secretAccessKey: 'customSecretAccessKey',
    address: 'custom.address',
    directory: 'custom/directory',
    allowMismatchedSignatures: true,
    resetOnClose: false,
    key: 'customKey',
    cert: 'customCert',
    serviceEndpoint: 'amazonaws.com',
    vhostBuckets: false,
  }
  let { inv } = await _inventory({ rawArc })
  let arc = inv._project.arc
  let { options, customBucketNames } = getS3rverOptions(arc['s3rver'])
  t.deepEqual(options, correctOptions, 'Got correct custom options')
  t.ok(customBucketNames.length == 0, 'Got empty bucket names')
})

test('Default s3rver options', async (t) => {
  t.plan(2)
  let rawArc = `
@app
app
`
  let { inv } = await _inventory({ rawArc })
  let arc = inv._project.arc
  let { options, customBucketNames } = getS3rverOptions(arc['s3rver'])
  t.deepEqual(options, correctDefaultOptions, 'Got correct custom options')
  t.ok(customBucketNames.length == 0, 'Got empty bucket names')
})
