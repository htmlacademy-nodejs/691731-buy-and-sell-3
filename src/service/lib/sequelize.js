'use strict';
const Sequelize = require(`sequelize`);
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

const somethingIsNotDefine = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD].some((it) => it === undefined);

if (somethingIsNotDefine) {
  throw new Error(`One or more enviromental variables are not defined`);
}

module.exports = new Sequelize(
    DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: `postgres`,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
