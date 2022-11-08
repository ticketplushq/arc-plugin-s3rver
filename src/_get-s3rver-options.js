module.exports = (s3rver) => {
  let customBucketNames = []
  let options = {
    port: 4568,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    address: 'localhost',
    directory: './buckets',
    allowMismatchedSignatures: true,
    resetOnClose: true,
  }

  if (s3rver) {
    const bucketsIndex = s3rver.findIndex((param) => param.buckets)
    if (bucketsIndex >= 0) {
      customBucketNames = customBucketNames.concat(s3rver[bucketsIndex].buckets)
    }

    const optionsIndex = s3rver.findIndex((param) => param.options)
    if (optionsIndex >= 0) {
      options =  { ...options, ...s3rver[optionsIndex].options }
    }
  }

  return {
    customBucketNames,
    options
  }
}
