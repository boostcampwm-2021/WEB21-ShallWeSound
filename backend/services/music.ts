import { Music } from '../types';

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
  async searchByPage(keyword: string, page: number) {
    const result = await MusicModel.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: '%' + keyword + '%' },
          singer: { [Op.like]: '%' + keyword + '%' },
        },
      },
      limit: 10,
      offset: page,
    });

    return result;
  },
  async findMusicsBy(MIDS: number[]) {
    const result = await MusicModel.findAll({
      attribute: ['MID', 'name', 'singer', 'path'],
      where: {
        MID: {
          [Op.or]: MIDS,
        },
      },
    });

    return result.map(
      (res: { MID: number; name: string; singer: string; path: string }): Music => ({
        MID: res.MID,
        title: res.name,
        singer: res.singer,
        src: res.path,
        isPlayed: false,
      }),
    );
  },
};
