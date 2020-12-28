'use strict';

const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  /**
   * Create new offer
   * @param {Object} offer
   * @returns {Object} new offer
   */
  create(offer) {
    const newOffer = Object
      .assign({ id: nanoid(MAX_ID_LENGTH), comments: [] }, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  /**
   * Delete offer with id
   * @param {String} id 
   * @returns {Object} deleted offer
   */
  drop(id) {
    const offer = this._offers.find((it) => it.id === id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((it) => it.id !== id);
    return offer;
  }

  /**
   * Return all offers
   */
  findAll() {
    return this._offers;
  }

  /**
   * Search offer with id
   * @param {String} id
   * @returns {Object} offer 
   */
  findOne(id) {
    return this._offers.find((it) => it.id === id);
  }

  /**
   * Update exist offer
   * @param {String} id 
   * @param {Object} offer
   * @returns {Object} updated offer 
   */
  update(id, offer) {
    const oldOffer = this._offers.find((it) => it.id === id);

    return Object.assign(oldOffer, offer);
  }
};

module.exports = OfferService;
