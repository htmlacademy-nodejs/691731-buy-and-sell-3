'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Книги`,
  `Цветы`,
  `Животные`,
  `Разное`
];

const mockOffers = [
  {
    "categories": [
      `Книги`,
      `Разное`
    ],
    "comments": [
      {
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`
      }
    ],
    "description": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `SALE`,
    "sum": 79555
  },
  {
    "categories": [
      `Цветы`,
      `Животные`
    ],
    "comments": [
      {
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `Неплохо, но дорого. Совсем немного...`
      },
      {
        "text": `Вы что?! В магазине дешевле.`
      }
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Даю недельную гарантию. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item02.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 55460
  },
  {
    "categories": [
      `Животные`
    ],
    "comments": [
      {
        "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `Даю недельную гарантию. Продаю с болью в сердце... Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
    "picture": `item12.jpg`,
    "title": `Куплю породистого кота`,
    "type": `SALE`,
    "sum": 81801
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const queryString = mockOffers[0].title;
const findedOffer = mockOffers.filter((offer) => offer.title.includes(queryString));
const badQueryString = `Some bad query string`;


const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  search(app, new SearchService(mockDB));
});

describe(`Test GET /search?query`, () => {
  describe(`+`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/search`)
        .query({
          query: queryString,
        });
    });

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`2 offers found`, () =>
      expect(response.body.length)
        .toBe(findedOffer.length)
    );
    test(`First offer has correct title`, () =>
      expect(response.body[0].title)
        .toBe(findedOffer[0].title)
    );
  });

  describe(`-`, () => {
    test(`API returns code 404 if nothing not found`,
        () => request(app)
          .get(`/search`)
          .query({
            query: badQueryString
          })
        .expect(HttpCode.NOT_FOUND)
    );

    test(`API returns code of 400 when query string is absent`,
        () => request(app)
          .get(`/search`)
          .expect(HttpCode.BAD_REQUEST)
    );
  });
});
