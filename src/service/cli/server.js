'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const http = require(`http`);

const DEFAULT_PORT = 3000;
const httpCode = {
  OK: 500,
  NOT_FOUND: 404,
};
const FILE_NAME = `mocks.json`;

const sendResponse = (res, options) => {
  const [statusCode, message] = options;
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>From Node with love!</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>${message}</body>
    </html>`.trim();

    res.statusCode = statusCode;
    res.writeHead(statusCode, {
      'Content-Type': `text/html; charset=UTF-8`,
    });

    res.end(template);
};

const onServerResponse = async (req, res) => {
  const notFoundMessageTxt = `Resourse is not found!`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_NAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, [httpCode.OK, `<ul>${message}</ul>`]);
      } catch (err) {
        sendResponse(res, [httpCode.NOT_FOUND, notFoundMessageTxt]);
      }
      break;
      default:
        sendResponse(res, [httpCode.NOT_FOUND, notFoundMessageTxt]);
        break;
  }
};

module.exports = {
  name: `--server`,
  run (args) {
    const [userPort] = args;
    const serverPort = Number.parseInt(userPort, 10) || DEFAULT_PORT;
    http.createServer(onServerResponse)
      .listen(serverPort)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Error while creating server: ${err}`));
        }

        return console.info(chalk.green(`Server start on port ${serverPort}`))
      });
  }
};
