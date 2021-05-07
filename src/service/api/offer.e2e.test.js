/* eslint-disable max-nested-callbacks */
'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Животные`,
  `Посуда`,
  `Марки`,
  `Разное`,
  `Книги`
];

const mockOffers = [
  {
    "categories": [
      `Животные`,
      `Марки`,
    ],
    "comments": [
      {
        "text": `Неплохо, но дорого. Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `А где блок питания? Неплохо, но дорого.`
      },
      {
        "text": `Оплата наличными или перевод на карту?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      }
    ],
    "description": `Продаю с болью в сердце... Даю недельную гарантию. Если найдёте дешевле — сброшу цену. Если товар не понравится — верну всё до последней копейки.`,
    "picture": `item02.jpg`,
    "title": `Куплю антиквариат`,
    "type": `OFFER`,
    "sum": 10405
  },
  {
    "categories": [
      `Посуда`
    ],
    "comments": [
      {
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ],
    "description": `Если товар не понравится — верну всё до последней копейки. Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города. Бонусом отдам все аксессуары.`,
    "picture": `item12.jpg`,
    "title": `Продам слона`,
    "type": `SALE`,
    "sum": 96693
  },
  {
    "categories": [
      `Марки`
    ],
    "comments": [
      {
        "text": `А сколько игр в комплекте? Почему в таком ужасном состоянии?`
      },
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`
      },
      {
        "text": `Совсем немного... Почему в таком ужасном состоянии?`
      },
      {
        "text": `А где блок питания?`
      }
    ],
    "description": `Таких предложений больше нет! Даю недельную гарантию. Это настоящая находка для коллекционера! Если товар не понравится — верну всё до последней копейки.`,
    "picture": `item12.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `OFFER`,
    "sum": 54666
  },
  {
    "categories": [
      `Разное`,
      `Марки`,
      `Посуда`
    ],
    "comments": [
      {
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    "description": `Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города. Таких предложений больше нет! Бонусом отдам все аксессуары.`,
    "picture": `item13.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `OFFER`,
    "sum": 29392
  },
  {
    "categories": [
      `Книги`
    ],
    "comments": [
      {
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    "description": `Продаю с болью в сердце... Бонусом отдам все аксессуары. Это настоящая находка для коллекционера! Даю недельную гарантию.`,
    "picture": `item16.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 46020
  }
];

const NOT_EXIST_ID = 100;

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  const app = express();
  app.use(express.json());
  offer(app, new OfferService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`Test GET /offers, only +`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code is 200`, () =>
    expect(response.statusCode)
      .toBe(HttpCode.OK)
  );
  test(`Returns a list of ${mockOffers.length} offers`, () =>
    expect(response.body.length)
      .toBe(mockOffers.length)
  );
  test(`The first offer's id is mockData[0].title`, () =>
    expect(response.body[0].title)
      .toBe(mockOffers[0].title)
  );
});

describe(`Test GET /offers/1`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/offers/1`);
  });

  describe(`+`, () => {

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Offer's title is correct`, () =>
      expect(response.body.title)
        .toBe(mockOffers[0].title)
    );
  });

  describe(`-`, () => {
    test(`API returns the status code of 400 if offer with id isn't exist`, () => {
      return request(app)
        .get(`/offers/${NOT_EXIST_ID}`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Test POST /offers`, () => {
  const newOffer = {
    categories: [1, 2],
    title: `Some title`,
    description: `Some describe`,
    pictures: [{src: `some_pic.jpg`}],
    type: `OFFER`,
    sum: 100500,
  };
  let response;
  let app;

  describe(`+`, () => {


    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    test(`Status code is 201`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.CREATED)
    );

    test(`Offers count is changed`, () =>
      request(app)
        .get(`/offers`)
        .expect((res) => expect(res.body.length).toBe(mockOffers.length + 1))
    );
  });

  describe(`-`, () => {
    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    test(`Without any required property response code is 400`, async () => {
      for (const key of Object.keys(newOffer)) {
        const badOffer = {...newOffer};
        delete badOffer[key];
        await request(app)
          .post(`/offers`)
          .send(badOffer)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`Test PUT /offers/2`, () => {
  const newOffer = {
    categories: [2],
    title: `Some title`,
    description: `Some describe`,
    pictures: [{src: `some_pic.jpg`}],
    type: `OFFER`,
    sum: 100500,
  };

  describe(`+`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/offers/2`)
        .send(newOffer);
    });


    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Offer is really changed`, () => request(app)
      .get(`/offers/2`)
      .expect((res) =>
        expect(res.body.title)
          .toBe(newOffer.title))
    );
  });

  describe(`-`, () => {
    test(`API returns status code 404 when trying to change non-existent offer`, async () => {
      const app = await createAPI();

      return request(app)
        .put(`/offers/${NOT_EXIST_ID}`)
        .send(newOffer)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
      const app = await createAPI();

      const invalidOffer = {
        category: `This`,
        title: `Not valid`,
        description: `Object`,
        picture: `Of offer`,
        type: `Not sum`,
      };

      return request(app)
        .put(`/offers/2`)
        .send(invalidOffer)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`Test DELETE /offers/offerId`, () => {
  describe(`+`, () => {
    let app;

    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/offers/3`);
    });

    test(`Status code 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Offers count is 4 now`, () =>
      request(app)
        .get(`/offers`)
        .expect((res) => expect(res.body.length).toBe(mockOffers.length - 1))
    );
  });

  describe(`-`, () => {
    test(`API refuse to delete non-existent offer`, async () => {
      const app = await createAPI();

      return request(app)
        .delete(`/offers/${NOT_EXIST_ID}`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Test GET /offers/offerId/comments`, () => {
  describe(`+`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/1/comments`);
    });

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Returns a list comments`, () =>
      expect(response.body.length)
        .toBe(mockOffers[0].comments.length)
    );
    test(`First comment has correct id`, () =>
      expect(response.body[0].text)
        .toBe(mockOffers[0].comments[0].text)
    );
  });

  describe(`-`, () => {
    test(`API returns status code 404, when trying to get comments for non-exist offer`, async () => {
      const app = await createAPI();

      return request(app)
        .get(`/offers/${NOT_EXIST_ID}/comments`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Test POST /offers/:offerId/comments`, () => {
  const newComment = {
    text: `Some comment`,
  };

  describe(`+`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers/1/comments`)
        .send(newComment);
    });

    test(`Status code is 201`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.CREATED)
    );
    test(`Returns new comment`, () =>
      expect(response.body)
        .toEqual(expect.objectContaining(newComment))
    );
    test(`Comments count more by one`, () =>
      request(app)
        .get(`/offers/1/comments`)
        .expect((res) =>
          expect(res.body.length)
            .toBe(mockOffers[0].comments.length + 1)
        )
    );
  });

  describe(`-`, () => {
    test(`API returns 404, if comments create for non-exist offer`, async () => {
      const app = await createAPI();

      return request(app)
        .post(`/offers/${NOT_EXIST_ID}/comments`)
        .send(newComment)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`API returns 400, if send invalid comments data`, async () => {
      const app = await createAPI();
      const invalidComment = {
        incorrectKey: `key must called "text"`
      };

      return request(app)
        .post(`/offers/1/comments`)
        .send(invalidComment)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`Test DELETE /offers/:offerId/comments/:commentId`, () => {
  describe(`+`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/offers/1/comments/1`);
    });

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );

    test(`Count of offers must decrease by one`, () =>
      request(app)
        .get(`/offers/1/comments`)
        .expect((res) =>
          expect(res.body.length)
            .toBe(mockOffers[0].comments.length - 1)
        )
    );
  });

  describe(`-`, () => {
    test(`API refuse to delete comment from non-existent offer`, async () => {
      const app = await createAPI();

      return request(app)
        .delete(`/offers/${NOT_EXIST_ID}/comments/1`)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`API refuse to delete non-existent comment`, async () => {
      const app = await createAPI();

      return request(app)
        .delete(`/offers/1/comments/${NOT_EXIST_ID}`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

