export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        credentials: {
          accessKeyId: env('SCALEWAY_ACCESS_KEY_ID'),
          secretAccessKey: env('SCALEWAY_ACCESS_SECRET'),
        },
        region: env('SCALEWAY_REGION'),
        endpoint: env('SCALEWAY_ENDPOINT'),
        rootPath: env('SCALEWAY_ROOT_PATH'),
        params: {
          ACL: 'private',
          Bucket: env('SCALEWAY_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      breakpoints: {
        large: 1920,
        medium: 650,
        small: 300,
      },
    },
  },
})
