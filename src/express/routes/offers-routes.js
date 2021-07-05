'use strict';

const {Router} = require(`express`);
const offersRoutes = new Router();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);
const api = require(`../api`).getAPI();

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
// Initial DiscStorage for save file
const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});
// Render category page
offersRoutes.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});
// Render page for add new offer
offersRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories(false);
  res.render(`offers/new-ticket`, {categories});
});
// Send to server new offer
offersRoutes.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const picture = Array(1).fill({}).map(() => ({src: file.filename}));

  const offerData = {
    pictures: picture,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.category)
  };
  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/offers/add?error=${encodeURIComponent(error.response.data)}`);
  }
});
// Render page for edit offer with {id}
offersRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const [item, categories] = await Promise.all([
    api.getOfferId(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {id, item, categories, error});
});
// Send to server edited offer
offersRoutes.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const offerData = {
    picture: file ? file.name : body[`old-image`],
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.category)
  };

  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/offers/edit/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});
// Render offer with {id}
offersRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const item = await api.getOfferId(id, true);
  res.render(`offers/ticket`, {item});
});
// Send to server new comment
offersRoutes.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/offers/${id}`);
  } catch (error) {
    res.redirect(`/offers/${id}/?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = offersRoutes;
