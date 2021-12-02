var DataTypes = require("sequelize").DataTypes;
var _MUSIC = require("./MUSIC");
var _USER = require("./USER");
var _sessions = require("./sessions");

function initModels(sequelize) {
  var MUSIC = _MUSIC(sequelize, DataTypes);
  var USER = _USER(sequelize, DataTypes);
  var sessions = _sessions(sequelize, DataTypes);


  return {
    MUSIC,
    USER,
    sessions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
