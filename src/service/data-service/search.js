'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

/**
 * Class with services for search offers
 * The constructor takes as a parameter the exemplar of sequelize (The object with connection settings to database)
 *
 * The method "findAll()" get a searchText (String) as a parameter and return promise (it get all offers from database, where title include search text)
 */
class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(searchText) {
    const offers = await this._Offer.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES, Aliase.PICTURES]
    });
    return offers.map((offer) => offer.get());
  }
}

module.exports = SearchService;
