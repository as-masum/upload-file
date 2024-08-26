const Sequelize = require("sequelize");
const { dbCredentials } = require("../config/index");

const sequelize = new Sequelize(
  dbCredentials.dbName,
  dbCredentials.dbUser,
  dbCredentials.dbPassword,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
  }
);

module.exports = sequelize;
