'use strict';

const got = require(`got`);

class API {
  constructor(prefixUrl, timeout) {
    this._http = got.extend({
      prefixUrl,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http({url, ...options});
    return JSON.parse(response.body);
  }

  getOffers() {
    return this._load(`offers`);
  }

  getOfferId(id) {
    return this._load(`offers/${id}`);
  }

  search(query) {
    return this._load(`search`, {searchParams: {query}});
  }

  getCategories() {
    return this._load(`categories`);
  }

  async createOffer(data) {
    const {body} = this._load(`offers`, {
      method: `POST`,
      json: data,
      responseType: `json`
    });

    return body;
  }
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
