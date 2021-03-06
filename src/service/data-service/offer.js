'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._Picture = sequelize.models.Picture;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.PICTURES],
      distinct: true
    });
    return {count, offers: rows};
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData, {include: [Aliase.PICTURES]});
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES, Aliase.PICTURES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    const offers = await this._Offer.findAll({include});
    return offers.map((item) => item.get());
  }

  findOne(id, needComments) {
    const include = [Aliase.CATEGORIES, Aliase.PICTURES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    return this._Offer.findByPk(id, {include});
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });

    return !!affectedRows;
  }
}

module.exports = OfferService;
