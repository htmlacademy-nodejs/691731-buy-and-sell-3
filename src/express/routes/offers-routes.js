'use strict';

const { Router } = require(`express`);
const offersRoutes = new Router();

offersRoutes.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});

offersRoutes.get(`/add`, (req, res) => {
  res.render(`offers/new-ticket`);
});

offersRoutes.get(`/edit/:id`, (req, res) => {
  res.render(`offers/ticket-edit`);
});

offersRoutes.get(`/:id`, (req, res) => {
  res.render(`offers/ticket`);
});

module.exports = offersRoutes;
