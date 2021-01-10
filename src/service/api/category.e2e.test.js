'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const CategoryService = require(`../data-service/category`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `m02QlG`,
    "title": `Продам ответы к ЕГЭ.`,
    "description": `Только самовывоз! Пользовались бережно и только по большим праздникам. Даю недельную гарантию. Таких предложений больше нет!`,
    "sum": 65446,
    "picture": `item04.jpeg`,
    "category": [`Сувениры`],
    "comments": [
      {
        "id": `rySY4F`,
        "text": `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Совсем немного...`
      },
      {
        "id": `47JkJI`,
        "text": `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Неплохо, но дорого.`
      }
    ]
  },
  {
    "id": `-CxFOn`,
    "title": `Куплю антиквариат.`,
    "description": `Это настоящая находка для коллекционера! Если товар не понравится — верну всё до последней копейки. Таких предложений больше нет! Товар в отличном состоянии.`,
    "sum": 73238,
    "picture": `item12.jpeg`,
    "category": [`Посуда`],
    "comments": [
      {
        "id": `isAyAs`,
        "text": `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      },
      {
        "id": `QNCSgD`,
        "text": `Неплохо, но дорого. Оплата наличными или перевод на карту? А сколько игр в комплекте?`
      },
      {
        "id": `C2AlVf`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`
      },
      {
        "id": `W_JHHu`,
        "text": `Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `fU-PgC`,
    "title": `Куплю подтяжки для носков.`,
    "description": `Только самовывоз! Товар в отличном состоянии. Продаю с болью в сердце... Бонусом отдам все аксессуары.`,
    "sum": 11949,
    "picture": `item11.jpeg`,
    "category": [`Игрушки`],
    "comments": [
      {
        "id": `EdhSKx`,
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "id": `qJLKKi`,
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "id": `Ss16JR`,
        "text": `А где блок питания?`
      }
    ]
  }
];

const testCategories = [...mockData.reduce((acc, offer) => {
  offer.category.forEach((it) => acc.add(it));
  return acc;
}, new Set())];

const app = express();
app.use(express.json());
category(app, new CategoryService(mockData));

describe(`Test GET /categories, only +`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode)
      .toBe(HttpCode.OK)
  );
  test(`Returns list of 3 categories`, () =>
    expect(response.body.length)
      .toBe(testCategories.length)
  );
  test(`Category names are equal testCategories`, () =>
    expect(response.body)
      .toEqual(
          expect.arrayContaining(testCategories)
      )
  );
});
