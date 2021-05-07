"use strict";

const {Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

const defineCategory = require(`./catrgory`);
const defineComment = require(`./comment`);
const definePicture = require(`./picture`);
const defineOffer = require(`./offer`);

// Auxiliary model for many-to-many relationship
class OfferCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Picture = definePicture(sequelize);
  const Offer = defineOffer(sequelize);

  // Offer -> Comment is One-to-many
  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  // Offer -> Picture is One-to-many
  Offer.hasMany(Picture, {as: Aliase.PICTURES, foreignKey: `offerId`});
  Picture.belongsTo(Offer, {foreignKey: `offerId`});

  OfferCategory.init({}, {sequelize});

  // Offer -> Category is Many-to-Many
  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES});

  return {Category, Comment, Picture, Offer, OfferCategory};
};

module.exports = define;
