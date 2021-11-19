const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'MUSIC',
    {
      MID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      singer: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      thumbnail: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      content_hash: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: 'content_hash_UNIQUE',
      },
    },
    {
      sequelize,
      tableName: 'MUSIC',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'MID' }],
        },
        {
          name: 'content_hash_UNIQUE',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'content_hash' }],
        },
        {
          type: 'FULLTEXT',
          fields: ['name', 'singer'],
        },
      ],
    },
  );
};
