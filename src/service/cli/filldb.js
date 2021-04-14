'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);


const defineModels = require(`../models`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils.js`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;

const FILE_CATEGORIES_PATH = `../../../data/categories.txt`;
const FILE_SENTENCES_PATH = `../../../data/sentences.txt`;
const FILE_TITLES_PATH = `../../../data/titles.txt`;
const FILE_COMMENTS_PATH = `../../../data/comments.txt`;

const MAX_COMMENTS = 5;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const ImagesRestrict = {
  MIN: 1,
  MAX: 16,
};

const logger = getLogger({});

const getImgFileName = () => {
  const fileNumber = getRandomInt(ImagesRestrict.MIN, ImagesRestrict.MAX);
  return Array(1).fill({}).map(() => ({
    src: fileNumber < 10 ? `item0${fileNumber}.jpg` : `item${fileNumber}.jpg`,
  }));
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generateOffers = (count, options) => {
  const {titles, sentences, categories, comments} = options;

  return Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(1, 5).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    pictures: getImgFileName(),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }));
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`).filter((it) => it.trim());
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error ocured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const {Category} = defineModels(sequelize);

    await sequelize.sync({force: true});

    const categoriesContent = await readContent(path.resolve(__dirname, FILE_CATEGORIES_PATH));

    const categoryModels = await Category.bulkCreate(
        categoriesContent.map((item) => ({name: item}))
    );

    const options = {
      titles: await readContent(path.resolve(__dirname, FILE_TITLES_PATH)),
      sentences: await readContent(path.resolve(__dirname, FILE_SENTENCES_PATH)),
      pictures: getImgFileName(),
      categories: categoryModels,
      comments: await readContent(path.resolve(__dirname, FILE_COMMENTS_PATH)),
    };

    const [count] = args;
    const countOffers = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = generateOffers(countOffers, options);

    return initDatabase(sequelize, {offers, categoryModels});
  }
};

