export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  db: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    dbSchema: process.env.DB_SCHEMA,
  },
});
