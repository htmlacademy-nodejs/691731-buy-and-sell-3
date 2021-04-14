'use strict';

const {Router} = require(`express`);
const mainRoutes = new Router();
const api = require(`../api`).getAPI();

mainRoutes.get(`/`, async (req, res) => {
  const [
    items,
    categories
  ] = await Promise.all([
    api.getOffers(false),
    api.getCategories(true)
  ]);
  res.render(`main`, {items, categories});
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
    console.log(results);
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
