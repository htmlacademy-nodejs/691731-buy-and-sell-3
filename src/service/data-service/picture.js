"use strict";

class PictureService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Picture = sequelize.models.Picture;
  }

  async create(offerId, pictureName) { // create a new picture for offer with offerId
    return this._Picture.create({
      offerId,
      ...pictureName
    });
  }

  async drop(id) {
    const deletedRows = this._Picture.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(offerId) {
    return this._Picture.findAll({
      where: {offerId},
      raw: true
    });
  }
}

module.exports = PictureService;
