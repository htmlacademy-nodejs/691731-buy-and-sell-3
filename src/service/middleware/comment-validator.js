'use strict';

const {HttpCode} = require(`../../constants`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const keyExist = commentKeys.every((key) => keys.includes(key));

  if (!keyExist) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
