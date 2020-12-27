'use strict';

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  //GET /api/search?query= — возвращает результаты поиска. Поиск объявлений выполняется по наименованию. Объявление соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.
  route.get(`/`, (req, res) => {
    const { query = `` } = req.query;

    if (!query) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json([]);
    }

    const searchResults = searchService.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res
      .status(searchStatus)
      .json(searchResults);
  });
};
