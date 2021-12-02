const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MUSIC', {
    MID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    singer: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    content_hash: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: "content_hash_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'MUSIC',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MID" },
        ]
      },
      {
        name: "content_hash_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "content_hash" },
        ]
      },
      {
        name: "m_u_s_i_c_name_singer",
        type: "FULLTEXT",
        fields: [
          { name: "name" },
          { name: "singer" },
        ]
      },
    ]
  });
};
