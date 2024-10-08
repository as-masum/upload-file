require("dotenv").config();

module.exports.dbCredentials = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
}

module.exports.redisCredentials = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT
}

module.exports.middelwareCredentials = {
  secretKey: process.env.JWT_SECRET,
}
module.exports.serverCredentials = {
  port: process.env.PORT,
}