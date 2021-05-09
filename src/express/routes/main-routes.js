'use strict';

const {Router} = require(`express`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const mainRoutes = new Router();
const api = require(`../api`).getAPI();

mainRoutes.get(`/`, async (req, res) => {
  // Get page number
  let {page = 1} = req.query;
  page = +page;

  // Number of requesting offers is equal offer's number on page
  const limit = OFFERS_PER_PAGE;

  // Number of offers to skip - number of offers on previous pages
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [
    {count, offers},
    categories
  ] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true)
  ]);

  // Number of pages - total number of offers divided by the number of offers per page
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  const items = offers;
  res.render(`main`, {items, categories, page, totalPages});
});

mainRoutes.get(`/register`, (req, res) => {
  res.render(`register`);
});

mainRoutes.get(`/login`, (req, res) => {
  res.render(`login`);
});

mainRoutes.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);
    res.render(`search`, {
      results
    });
  } catch (err) {
    res.render(`search`, {
      results: []
    });
  }
});

module.exports = mainRoutes;
