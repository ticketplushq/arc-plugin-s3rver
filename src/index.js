const { updater } = require('@architect/utils')
const getS3rverOptions = require('./_get-s3rver-options')
const update = updater('S3 Buckets', {})

let s3rverInstance

module.exports = {
  sandbox: {
    start: async ({ arc }) => {
      // eslint-disable-next-line global-require
      const S3rver = require('s3rver')
      let bucketNames = [];

      [ 'public', 'private' ].forEach((privacy) => {
        if (arc[`storage-${privacy}`]) {
          bucketNames = bucketNames.concat(arc[`storage-${privacy}`])
        }
      })

      let { options, customBucketNames } = getS3rverOptions(arc['s3rver'])
      if (customBucketNames.length > 0) {
        bucketNames = bucketNames.concat(customBucketNames)
      }

      const configureBuckets = bucketNames.map((bucketName) => {
        return { name: bucketName }
      })

      update.start('Starting up S3rver...')
      s3rverInstance = new S3rver({ configureBuckets, ...options })
      await s3rverInstance.run()
      update.done('S3rver started')
    },
    end: async () => {
      if (!s3rverInstance) return

      update.start('Shutting down S3rver...')
      try {
        await s3rverInstance.close()
        update.done('S3rver gracefully shut down')
      }
      catch (e) {
        update.error('Error shuting down S3rver!', e)
      }
    },
  },
  set: {
    env: ({ arc }) => {
      let bucketNames = []

      let storageEnvs = {};
      [ 'public', 'private' ].forEach((privacy) => {
        if (arc[`storage-${privacy}`]) {
          bucketNames = bucketNames.concat(arc[`storage-${privacy}`])
          arc[`storage-${privacy}`].forEach((bucket) => {
            storageEnvs[
              `ARC_STORAGE_${privacy.toUpperCase()}_${bucket.replace(/-/g, '_').toUpperCase()}`
            ] = bucket
          })
        }
      })

      let { options, customBucketNames } = getS3rverOptions(arc['s3rver'])
      if (customBucketNames.length > 0) {
        bucketNames = bucketNames.concat(customBucketNames)
      }

      const s3rverConfig = {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        endpoint: `http://${options.address}:${options.port}`,
        s3ForcePathStyle: true
      }

      return {
        testing: {
          ARC_S3RVER_CONFIG: JSON.stringify(s3rverConfig),
          ...storageEnvs
        }
      }
    }
  }
}
