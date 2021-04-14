'use strict';

const {Router} = require(`express`);
const myRoutes = new Router();
const api = require(`../api`).getAPI();

myRoutes.get(`/`, async (req, res) => {
  const myItems = await api.getOffers(false);
  res.render(`my-tickets`, {myItems});
});

myRoutes.get(`/comments`, async (req, res) => {
  const myItems = await api.getOffers({comments: true});
  res.render(`comments`, {myItems: myItems.slice(0, 3)});
});

module.exports = myRoutes;
