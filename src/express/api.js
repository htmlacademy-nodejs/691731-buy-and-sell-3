'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
  // Returns {limit} list of offers with comments
  getOffers({offset, limit, comments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, comments}});
  }
  // Returns offer with {id} and list {comments}
  getOfferId(id, comments) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }
  // Search offers with title which include {query}
  search(query) {
    return this._load(`/search`, {params: {query}});
  }
  // Return list of categories and {count} of each category
  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }
  // Create offer with {data}
  createOffer(data) {
    return this._load(`/offers`, {
      method: HttpMethod.POST,
      data,
    });
  }
  // Save new {data} in offer with {id}
  editOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }
  // Create new comment with {data} to offer with {id}
  createComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
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
