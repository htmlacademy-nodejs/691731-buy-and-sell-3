'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const FILE_NAME = `../../../mocks.json`;

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(path.resolve(__dirname, FILE_NAME));
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(chalk.red(err));
  }

  return data;
};

module.exports = getMockData;
