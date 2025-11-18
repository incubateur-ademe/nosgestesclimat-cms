export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env.int('SMTP_PORT'),
        secure: env.bool('SMTP_SECURE'),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO'),
      },
    },
  },
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
