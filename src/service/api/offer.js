'use strict';

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);
const commentValidator = require(`../middleware/comment-validator`);
const offerValidator = require(`../middleware/offer-validator`);
const offerExist = require(`../middleware/offer-exist`);

const route = new Router();

module.exports = (app, offerServices, commentService) => {
  app.use(`/offers`, route);

  // GET /api/offers — ресурс возвращает список объявлений;
  route.get(`/`, (req, res) => {
    const offers = offerServices.findAll();
    return res
      .status(HttpCode.OK)
      .json(offers);
  });

  // GET /api/offers/:offerId — возвращает полную информацию определённого объявления
  route.get(`/:offerId`, (req, res) => {
    const { offerId } = req.params;
    const offer = offerServices.findOne(offerId);

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
  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerServices.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(offer);
  });

  // PUT /api/offers/:offerId — редактирует определённое объявление;
  route.put(`/:offerId`, offerValidator, (req, res) => {
    const { offerId } = req.params;
    const existOffer = offerServices.findOne(offerId);

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
  route.delete(`/:offerId`, (req, res) => {
    const { offerId } = req.params;
    const offer = offerServices.drop(offerId);

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
  route.get(`/:offerId/comments`, offerExist(offerServices), (req, res) => {
    const { offer } = res.locals;
    const comments = commentService.findAll(offer);
  
    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  // POST /api/offers/:offerId/comments — создаёт новый комментарий;
  route.post(`/:offerId/comments`, [offerExist(offerServices), commentValidator], (req, res) => {
    const { offer } = res.locals;
    const comment = commentService.create(offer, req.body);

    return res
      .status(HttpCode.OK)
      .json(comment);
  });

  // DELETE /api/offers/:offerId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором;
  route.delete(`/:offerId/comments/:commentId`, offerExist(offerServices), (req, res) => {
    const { offer } = res.locals;
    const { commentId } = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res
      .status(HttpCode.OK)
      .json(deletedComment)
  });
}
