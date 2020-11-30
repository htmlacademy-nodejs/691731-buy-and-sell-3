'use strict';

const { Router } = require(`express`);
const offersRoutes = new Router();

offersRoutes.get(`/:id`, (req, res) => {
  res.send(`/offers/${req.params.id}`);
});

offersRoutes.get(`/add`, (req, res) => {
  res.send(`/offers/add`);
});

offersRoutes.get(`/category/:id`, (req, res) => {
  res.send(`/offers/category/${req.params.id}`);
});

offersRoutes.get(`/edit/:id`, (req, res) => {
  res.send(`/edit/${req.params.id}`);
});

module.exports = offersRoutes;
