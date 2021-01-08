'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  /**
   * Create new comment
   * @param {Object} offer
   * @param {Object} comment
   * @return {String} comment
   */
  create(offer, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    offer.comments.push(newComment);
    return comment;
  }

  /**
   * Delet some comment with commentId
   * @param {Object} offer
   * @param {String} commentId
   * @return {String} deleted comment
   */
  drop(offer, commentId) {
    const dropComment = offer.comments
      .find((comment) => comment.id === commentId);

    if (!dropComment) {
      return null;
    }

    offer.comments = offer.comments
      .filter((comment) => comment.id !== commentId);

    return dropComment;
  }

  /**
   * Return all comments from Offer
   * @param {Object} offer
   * @return {Array} comments
   */
  findAll(offer) {
    return offer.comments;
  }
}

module.exports = CommentService;
