'use strict';

const {HttpCode} = require(`../../constants`);

const offerKeys = [`categories`, `description`, `pictures`, `title`, `type`, `sum`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keyExist = offerKeys.every((key) => keys.includes(key));

  if (!keyExist) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
