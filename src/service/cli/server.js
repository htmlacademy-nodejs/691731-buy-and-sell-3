'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);
const { HttpCode } = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;

const app = express();

app.use(express.json());
app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks)
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

app.use((req, res) => {
  res
    .status(HttpCode.BAD_REQUEST)
    .send(`Not found`);
});

module.exports = {
  name: `--server`,
  run (args) {
    const [userPort] = args;
    const serverPort = Number.parseInt(userPort, 10) || DEFAULT_PORT;
    app.listen(serverPort, (err) => {
      if (err) {
        return console.error(chalk.red(`Error while creating server: ${err}`));
      }

      return console.info(chalk.green(`Server start on port ${serverPort}`));
    });
  }
};
