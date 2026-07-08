const path = require("path");
const dotenv = require("dotenv");

// Sequelize CLI reads this file from src/config, so walk back to server/.env.
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

function createConfig(databaseFallback) {
  return {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || databaseFallback,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || "mysql",
    // Keep KakaoTalk local times stable when Sequelize writes DATETIME values.
    timezone: process.env.DB_TIMEZONE || "+09:00",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  };
}

module.exports = {
  development: createConfig("project_ssj_development"),
  test: createConfig("project_ssj_test"),
  production: createConfig("project_ssj_production"),
};
