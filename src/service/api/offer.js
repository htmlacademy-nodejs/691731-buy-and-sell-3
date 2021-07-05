'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentValidator = require(`../middleware/comment-validator`);
const offerValidator = require(`../middleware/offer-validator`);
const offerExist = require(`../middleware/offer-exist`);
const routeParamsValidator = require(`../middleware/route-params-validator`);

module.exports = (app, offerServices, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  // GET /api/offers — ресурс возвращает список объявлений;
  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let offers;
    if (limit || offset) {
      offers = await offerServices.findPage({limit, offset});
    } else {
      offers = await offerServices.findAll(comments);
    }
    return res
      .status(HttpCode.OK)
      .json(offers);
  });

  // GET /api/offers/:offerId — возвращает полную информацию определённого объявления
  route.get(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const {comments} = req.query;
    const offer = await offerServices.findOne(offerId, comments);

    if (!offer) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Offer with id: ${offerId} didn't found`);
    }

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  // POST /api/offers — создаёт новое объявление;
  route.post(`/`, [routeParamsValidator, offerValidator], async (req, res) => {
    const offer = await offerServices.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  // PUT /api/offers/:offerId — редактирует определённое объявление;
  route.put(`/:offerId`, [routeParamsValidator, offerValidator], async (req, res) => {
    const {offerId} = req.params;
    const existOffer = await offerServices.findOne(offerId);

    if (!existOffer) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Offer with id: ${offerId} didn't found`);
    }

    const updateOffer = offerServices.update(offerId, req.body);

    return res
      .status(HttpCode.OK)
      .json(updateOffer);
  });

  // DELETE /api/offers/:offerId — удаляет определённое объявление;
  route.delete(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerServices.drop(offerId);

    if (!offer) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Offer with id: ${offerId} didn't found`);
    }

    return res
      .status(HttpCode.OK)
      .json(offer);
  });

  // GET /api/offers/:offerId/comments — возвращает список комментариев определённого объявления;
  route.get(`/:offerId/comments`, [routeParamsValidator, offerExist(offerServices)], async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentService.findAll(offerId);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  // POST /api/offers/:offerId/comments — создаёт новый комментарий;
  route.post(`/:offerId/comments`, [routeParamsValidator, offerExist(offerServices), commentValidator], async (req, res) => {
    const {offerId} = req.params;
    const comment = await commentService.create(offerId, req.body);

    return res
      .status(HttpCode.CREATED)
      .json(comment);
  });

  // DELETE /api/offers/:offerId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором;
  route.delete(`/:offerId/comments/:commentId`, [routeParamsValidator, offerExist(offerServices)], async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res
      .status(HttpCode.OK)
      .json(deletedComment);
  });
};
