      export default ({ env }: { env: (key: string) => string }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("EMAIL_HOST"),
        port: env("EMAIL_PORT"),
        secure:true,
        auth: {
          user: env("EMAIL_USER"),
          pass: env("EMAIL_PASS"),
        },
        tls: {
          rejectUnauthorized: true,
        },
      },
      settings: {
        defaultFrom: env("EMAIL_USER"),
        defaultReplyTo: env("EMAIL_USER"),
        resetPasswordUrl: 'https://mydomain.com/admin/auth/reset-password',
      },
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),                                 
      },
      actionOptions: {
        upload: {},
        delete: {},     
      },
    },
  },
});
