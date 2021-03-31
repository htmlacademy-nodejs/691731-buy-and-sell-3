'use strict';

const express = require(`express`);
const routes = require(`../api`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const {HttpCode, API_PREFIX, ExitCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const logger = getLogger({name: `api`});

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  logger.debug(`Request on route: ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code: ${res.statusCode}`);
  });
  next();
});
app.use(API_PREFIX, routes);
app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});
app.use((err, _req, res, _next) => {
  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(`Internal server error`);
  logger.error(`An error occured on processing request: ${err.message}`);
});

process.on(`unhandledRejection`, (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const [userPort] = args;
    const serverPort = Number.parseInt(userPort, 10) || DEFAULT_PORT;
    try {
      await app.listen(serverPort);
      logger.info(`Server starting on port ${serverPort}`);
    } catch (err) {
      logger.error(`Error: ${err}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
