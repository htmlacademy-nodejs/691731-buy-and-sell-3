'use strict';

class CommentService {
  constructor(sequlize) {
    this._Offer = sequlize.models.Offer;
    this._Comment = sequlize.models.Comment;
  }

  create(offerId, comment) { // create a new comment for offer fith offerId
    return this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(id) { // delete some comment with some id
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(offerId) { // return all comments for offer with some offerId
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }
}

module.exports = CommentService;
