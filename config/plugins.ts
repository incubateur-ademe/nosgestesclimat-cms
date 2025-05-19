export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('SCALEWAY_ACCESS_KEY_ID'),
            secretAccessKey: env('SCALEWAY_ACCESS_SECRET'),
          },
          region: env('SCALEWAY_REGION'),
          endpoint: env('SCALEWAY_ENDPOINT'),
          params: {
            Bucket: env('SCALEWAY_BUCKET'),
          },
        },
        rootPath: env('SCALEWAY_ROOT_PATH'),
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
  'color-picker': {
    enabled: true,
    config: {
      format: 'hex',
      enableAlpha: true,
    },
  },
})
