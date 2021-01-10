'use strict';

const express = require(`express`);
const routes = require(`../api`);
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
app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
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
