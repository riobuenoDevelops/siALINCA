require("dotenv").config({ path: __dirname + "/./../.env" });

const config = {
	dev: process.env.NODE_ENV !== "production",
	url: process.env.URL || "http://localhost:3000",
	dbHost: process.env.DB_HOST,
	dbPort: process.env.DB_PORT,
	dbName: process.env.DB_NAME,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
};

module.exports = { config };
