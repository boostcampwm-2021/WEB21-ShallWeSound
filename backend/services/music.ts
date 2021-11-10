const MusicModel = require('../models').MUSIC;
const Op = require('sequelize').Op;

export default {
  async search(keyword: string) {
    const result = await MusicModel.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: '%' + keyword + '%' },
          singer: { [Op.like]: '%' + keyword + '%' },
        },
      },
    });

    return result;
  },
};
