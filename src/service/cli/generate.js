'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils.js`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `./mocks.json`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};


const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const getImgFileName = () => {
  const fileNumber = getRandomInt(1, 16);
  return fileNumber < 10 ? `item0${fileNumber}.jpeg` : `item${fileNumber}.jpeg`;
};

const generateOffers = (count, options) => {
  const {titles, sentences, categories} = options;

  return Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[Math.floor(Math.random * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(1, 5).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getImgFileName(),
    category: [categories[getRandomInt(0, categories.length - 1)]]
  }))
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`).filter(it => it.trim());
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const options = {
      titles: await readContent(FILE_TITLES_PATH),
      sentences: await readContent(FILE_SENTENCES_PATH),
      categories: await readContent(FILE_CATEGORIES_PATH),
    }

    const [count] = args;
    const countOffers = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffers, options));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

