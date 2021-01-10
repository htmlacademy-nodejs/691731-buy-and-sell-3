'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `Ya7Awt`,
    "title": `Продам ответы к ЕГЭ.`,
    "description": `Товар в отличном состоянии. Комплект зимней резины в подарок. Только самовывоз! Это настоящая находка для коллекционера!`,
    "sum": 77351,
    "picture": `item09.jpeg`,
    "category": [`Сувениры`],
    "comments": [
      {
        "id": `AZlJbA`,
        "text": `А сколько игр в комплекте? Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `3PjsPu`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `XV7-dL`,
    "title": `Продам книги Стивена Кинга.`,
    "description": `Бонусом отдам все аксессуары. Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки. При покупке с меня бесплатная доставка в черте города.`,
    "sum": 22055,
    "picture": `item05.jpeg`,
    "category": [`Сувениры`],
    "comments": [
      {
        "id": `cRhW71`,
        "text": `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? А сколько игр в комплекте?`
      },
      {
        "id": `eqcVIe`,
        "text": `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `hu86cG`,
        "text": `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`
      },
      {
        "id": `TvpqxM`,
        "text": `Неплохо, но дорого. А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `_Csxq0`,
        "text": `С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "id": `RspE7O`,
    "title": `Куплю антиквариат.`,
    "description": `Продаю с болью в сердце... Таких предложений больше нет! Пользовались бережно и только по большим праздникам. Комплект зимней резины в подарок.`,
    "sum": 75582,
    "picture": `item11.jpeg`,
    "category": [`Животные`],
    "comments": [
      {
        "id": `jtNlTI`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Совсем немного...`
      },
      {
        "id": `lWwr-r`,
        "text": `А где блок питания? С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "id": `QKf97x`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "description": `Продаю с болью в сердце... Только самовывоз! Бонусом отдам все аксессуары. Товар в отличном состоянии.`,
    "sum": 79212,
    "picture": `item14.jpeg`,
    "category": [`Посуда`],
    "comments": [
      {
        "id": `UgPtR-`,
        "text": `Совсем немного...`
      },
      {
        "id": `VVnxgW`,
        "text": `Совсем немного...`
      },
      {
        "id": `MX93fx`,
        "text": `Оплата наличными или перевод на карту? А где блок питания? Неплохо, но дорого.`
      },
      {
        "id": `KXjlE1`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      },
      {
        "id": `0-Yw-Y`,
        "text": `А где блок питания?`
      }
    ]
  },
  {
    "id": `zRfhAh`,
    "title": `Куплю антиквариат.`,
    "description": `Это настоящая находка для коллекционера! Если товар не понравится — верну всё до последней копейки. Таких предложений больше нет! Пользовались бережно и только по большим праздникам.`,
    "sum": 33505,
    "picture": `item14.jpeg`,
    "category": [`Бумага`],
    "comments": [
      {
        "id": `c4OCLt`,
        "text": `Оплата наличными или перевод на карту?`
      },
      {
        "id": `mTqY0E`,
        "text": `А где блок питания?`
      },
      {
        "id": `6_kBLO`,
        "text": `Оплата наличными или перевод на карту? А где блок питания? С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `DYPSLi`,
        "text": `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?`
      }
    ]
  }
];

const queryString = mockData[0].title.slice(0, 5);
const findedOffer = mockData.filter((offer) => offer.title.includes(queryString));
const badQueryString = `Some bad query string`;


const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

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
    test(`First offer has correct id`, () =>
      expect(response.body[0].id)
        .toBe(findedOffer[0].id)
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
