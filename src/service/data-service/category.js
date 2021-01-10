'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }
  /**
   * Search all with some category
   * @return {Array} categories
   */
  findAll() {
    const categories = this._offers.reduce((acc, offer) => {
      offer.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
