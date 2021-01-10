'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `vmjqNw`,
    "title": `Продам отличную подборку фильмов на VHS.`,
    "description": `Товар в отличном состоянии. Только самовывоз! Если найдёте дешевле — сброшу цену. Пользовались бережно и только по большим праздникам.`,
    "sum": 51492,
    "picture": `item07.jpeg`,
    "category": [`Обувь`],
    "comments": [
      {
        "id": `1vAuPE`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      },
      {
        "id": `4gAknl`,
        "text": `А сколько игр в комплекте?`
      },
      {
        "id": `oQzwnY`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `Q31ch-`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "description": `Это настоящая находка для коллекционера! Продаю с болью в сердце... При покупке с меня бесплатная доставка в черте города. Товар в отличном состоянии.`,
    "sum": 47988,
    "picture": `item07.jpeg`,
    "category": [`Книги`],
    "comments": [
      {
        "id": `UsDp9A`,
        "text": `Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?`
      },
      {
        "id": `_7i0aW`,
        "text": `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `Vpk9pR`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `GXsAuf`,
    "title": `Куплю слона.`,
    "description": `При покупке с меня бесплатная доставка в черте города. Комплект зимней резины в подарок. Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену.`,
    "sum": 43215,
    "picture": `item11.jpeg`,
    "category": [`Игрушки`],
    "comments": [
      {
        "id": `m3O5EX`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии? А где блок питания?`
      },
      {
        "id": `lcPerQ`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      },
      {
        "id": `9P_Bjl`,
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `9IiauQ`,
        "text": `Совсем немного... Неплохо, но дорого. Почему в таком ужасном состоянии?`
      },
      {
        "id": `mr7bFE`,
        "text": `Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    "id": `BvU3r1`,
    "title": `Продам носки. Почти не ношенные.`,
    "description": `При покупке с меня бесплатная доставка в черте города. Комплект зимней резины в подарок. Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию.`,
    "sum": 67210,
    "picture": `item09.jpeg`,
    "category": [`Сувениры`],
    "comments": [
      {
        "id": `1zDYII`,
        "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Совсем немного...`
      },
      {
        "id": `3q_TYh`,
        "text": `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. А где блок питания?`
      }
    ]
  },
  {
    "id": `0hkrGv`,
    "title": `Продам коллекцию журналов «Огонёк».`,
    "description": `Только самовывоз! Даю недельную гарантию. Товар в отличном состоянии. Продаю с болью в сердце...`,
    "sum": 48934,
    "picture": `item15.jpeg`,
    "category": [`Животные`],
    "comments": [
      {
        "id": `V7at1p`,
        "text": `А сколько игр в комплекте? А где блок питания?`
      },
      {
        "id": `Zi29gN`,
        "text": `Почему в таком ужасном состоянии?`
      }
    ]
  }
];

const NOT_EXIST_ID = `NOT_EXIST`;

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new OfferService(cloneData), new CommentService());

  return app;
};

describe(`Test GET /offers, only +`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code is 200`, () =>
    expect(response.statusCode)
      .toBe(HttpCode.OK)
  );
  test(`Returns a list of 5 offers`, () =>
    expect(response.body.length)
      .toBe(mockData.length)
  );
  test(`The first offer's id is mockData[0].id`, () =>
    expect(response.body[0].id)
      .toBe(mockData[0].id)
  );
});

describe(`Test GET /offers/:offerID`, () => {
  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/${mockData[1].id}`);
    });

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Offer's title is correct`, () =>
      expect(response.body.title)
        .toBe(mockData[1].title)
    );
  });

  describe(`-`, () => {
    test(`API returns the status code of 400 if offer with id isn't exist`, () => {
      const app = createAPI();
      return request(app)
        .get(`/offers/${NOT_EXIST_ID}`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Test POST /offers`, () => {
  const newOffer = {
    category: `Some category`,
    title: `Some title`,
    description: `Some discribe`,
    picture: `some_pic.jpg`,
    type: `OFFER`,
    sum: 100500,
  };

  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    test(`Status code is 201`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.CREATED)
    );
    test(`Returns offer created`, () =>
      expect(response.body)
        .toEqual(expect.objectContaining(newOffer))
    );
    test(`Offers count is changed`, () =>
      request(app)
        .get(`/offers`)
        .expect((res) => expect(res.body.length).toBe(mockData.length + 1))
    );
  });

  describe(`-`, () => {
    const app = createAPI();

    test(`Without any required property response code is 400`, async () => {
      for (const key of Object.keys(newOffer)) {
        const badOffer = { ...newOffer };
        delete badOffer[key];
        await request(app)
          .post(`/offers`)
          .send(badOffer)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`Test PUT /offers/:offerId`, () => {
  const newOffer = {
    category: `Some category`,
    title: `Some title`,
    description: `Some discribe`,
    picture: `some_pic.jpg`,
    type: `OFFER`,
    sum: 100500,
  };

  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/${mockData[2].id}`)
        .send(newOffer);
    });

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Returns changed offer`, () =>
      expect(response.body)
        .toEqual(expect.objectContaining(newOffer))
    );
    test(`Offer is really changed`, () => request(app)
      .get(`/offers/${mockData[2].id}`)
      .expect((res) =>
        expect(res.body.title)
          .toBe(newOffer.title))
    );
  });

  describe(`-`, () => {
    test(`API returns status code 404 when trying to change non-existent offer`, () => {
      const app = createAPI();

      return request(app)
        .put(`/offers/${NOT_EXIST_ID}`)
        .send(newOffer)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
      const app = createAPI();

      const invalidOffer = {
        category: `This`,
        title: `Not valid`,
        description: `Object`,
        picture: `Of offer`,
        type: `Not sum`,
      };

      return request(app)
        .put(`/offers/${mockData[2].id}`)
        .send(invalidOffer)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`Test DELETE /offers/offerId`, () => {
  describe(`+`, () => {
    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/offers/${mockData[4].id}`);
    });

    test(`Status code 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Returns deleted offer`, () =>
      expect(response.body.id)
        .toBe(mockData[4].id)
    );
    test(`Offers count is 4 now`, () =>
      request(app)
        .get(`/offers`)
        .expect((res) => expect(res.body.length).toBe(mockData.length - 1))
    );
  });

  describe(`-`, () => {
    test(`API refuse to delete non-existent offer`, () => {
      const app = createAPI();

      return request(app)
        .delete(`/offers/${NOT_EXIST_ID}`)
        .expect(HttpCode.NOT_FOUND)
    });
  });
});

describe(`Test GET /offers/offerId/comments`, () => {
  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/${mockData[0].id}/comments`);
    });

    test(`Status code is 200`, () => 
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );
    test(`Returns a list comments`, () =>
      expect(response.body.length)
        .toBe(mockData[0].comments.length)
    );
    test(`First comment has correct id`, () =>
      expect(response.body[0].id)
        .toBe(mockData[0].comments[0].id)
    );
  });

  describe(`-`, () => {
    test(`API returns status code 404, when trying to get comments for non-exist offer`, () => {
      const app = createAPI();

      return request(app)
        .get(`/offers/${NOT_EXIST_ID}/comments`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Test POST /offers/:offerId/comments`, () => {
  const newComment = {
    text: `Some comment`,
  }

  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/offers/${mockData[0].id}/comments`)
        .send(newComment)
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
        .get(`/offers/${mockData[0].id}/comments`)
        .expect((res) =>
          expect(res.body.length)
            .toBe(mockData[0].comments.length + 1)
        )
    );
  });

  describe(`-`, () => {
    test(`API returns 404, if comments create for non-exist offer`, () => {
      const app = createAPI();

      return request(app)
        .post(`/offers/${NOT_EXIST_ID}/comments`)
        .send(newComment)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`API returns 400, if send invalid comments data`, () => {
      const app = createAPI();
      const invalidComment = {
        incorrectKey: `key must called "text"`
      };

      return request(app)
        .post(`/offers/${mockData[0].id}/comments`)
        .send(invalidComment)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`Test DELETE /offers/:offerId/comments/:commentId`, () => {
  describe(`+`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/offers/${mockData[2].id}/comments/${mockData[2].comments[0].id}`)
    });

    test(`Status code is 200`, () =>
      expect(response.statusCode)
        .toBe(HttpCode.OK)
    );

    test(`Returns deleted comment`, () =>
      expect(response.body)
        .toEqual(expect.objectContaining(mockData[2].comments[0]))
    );

    test(`Count of offers must decrease by one`, () =>
      request(app)
        .get(`/offers/${mockData[2].id}/comments`)
        .expect((res) =>
          expect(res.body.length)
            .toBe(mockData[2].comments.length - 1)
        )
    );
  });

  describe(`-`, () => {
    test(`API refuse to delete comment from non-existent offer`, () => {
      const app = createAPI();

      return request(app)
        .delete(`/offers/${NOT_EXIST_ID}/comments/${mockData[0].comments[0].id}`)
        .expect(HttpCode.NOT_FOUND)
    });

    test(`API refuse to delete non-existent comment`, () => {
      const app = createAPI();

      return request(app)
        .delete(`/offers/${mockData[0].id}/comments/${NOT_EXIST_ID}`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});
