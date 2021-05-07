'use strict';

const {Router} = require(`express`);
const offersRoutes = new Router();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

offersRoutes.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});

offersRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories(false);
  res.render(`offers/new-ticket`, {categories});
});

offersRoutes.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const picture = Array(1).fill({}).map(() => ({src: file.filename}));

  const offerData = {
    pictures: picture,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: body.category
  };
  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

offersRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [item, categories] = await Promise.all([
    api.getOfferId(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {item, categories});
});

offersRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const item = await api.getOfferId(id, true);
  res.render(`offers/ticket`, {item});
});

module.exports = offersRoutes;
