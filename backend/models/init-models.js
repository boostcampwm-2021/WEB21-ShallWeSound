var DataTypes = require("sequelize").DataTypes;
var _MUSIC = require("./MUSIC");

function initModels(sequelize) {
  var MUSIC = _MUSIC(sequelize, DataTypes);


  return {
    MUSIC,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
