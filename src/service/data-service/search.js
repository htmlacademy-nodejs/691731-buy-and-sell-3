'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  /**
   * Search all offers, which include searching text
   * @param {String} searchText
   * @return {Array} offers
   */
  findAll(searchText) {
    return this._offers
      .filter((offer) => offer.title.includes(searchText));
  }
}

module.exports = SearchService;
