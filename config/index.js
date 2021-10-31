require("dotenv").config({ path: __dirname + "/./../.env" });

const config = {
  dev: process.env.NODE_ENV !== "production",
  url: process.env.URL || "http://localhost:3000",
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  passwordSecret: process.env.NEXT_PUBLIC_PASSWORD_SECRET,
  ablyApiKey: process.env.NEXT_ABLY_PRIVATE_API_KEY,
  apiUrl: `${this.url}/${process.env.API_URL}`,
};

module.exports = { config };
