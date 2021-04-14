"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Picture extends Model {}

const define = (sequelize) => Picture.init({
  src: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  modelName: `Picture`,
  tableName: `pictures`
});

module.exports = define;
