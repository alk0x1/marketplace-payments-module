export default () => ({
  port: Number.parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  iugu: {
    apiToken: process.env.IUGU_API_TOKEN,
    accountId: process.env.IUGU_ACCOUNT_ID,
    testMode: process.env.IUGU_TEST_MODE === 'true',
  },
  platform: {
    feePercent: Number.parseInt(process.env.PLATFORM_FEE_PERCENT || '10', 10),
    autoConfirmDays: Number.parseInt(process.env.AUTO_CONFIRM_DAYS || '7', 10),
  },
});
