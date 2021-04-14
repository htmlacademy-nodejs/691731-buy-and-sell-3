'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const offer = require(`./offer`);
const search = require(`./search`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  CommentService,
  OfferService,
  SearchService,
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(async () => {

  category(app, new CategoryService(sequelize));
  offer(app, new OfferService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
