'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (offerService) => async (req, res, next) => {
  const {offerId} = req.params;
  const offer = await offerService.findOne(offerId);
  if (!offer) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Offer with id ${offerId} not found`);
  }

  return next();
};
