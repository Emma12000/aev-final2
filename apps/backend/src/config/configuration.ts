export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    privateKey: (process.env.JWT_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    publicKey: (process.env.JWT_PUBLIC_KEY ?? '').replace(/\\n/g, '\n'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },

  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY ?? '',
    bucket: process.env.SUPABASE_BUCKET ?? 'aev-documents',
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    from: process.env.EMAIL_FROM ?? 'no-reply@espoiretvie.td',
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@espoiretvie.td',
  },

  upload: {
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '50', 10),
    allowedMimeTypes: (
      process.env.ALLOWED_MIME_TYPES ??
      'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.presentation,image/png,image/jpeg'
    ).split(','),
  },
});
