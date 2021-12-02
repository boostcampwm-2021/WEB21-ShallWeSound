import { Music } from '../types';

const MusicModel = require('../models').MUSIC;
const Op = require('sequelize').Op;

export default {
  async searchByPage(keyword: string, page: number) {
    try {
      const result = await MusicModel.findAll({
        where: {
          [Op.or]: {
            name: { [Op.like]: '%' + keyword + '%' },
            singer: { [Op.like]: '%' + keyword + '%' },
          },
        },
        replacements: {
          keyword: keyword,
        },
        limit: 11,
        offset: page,
      });

      if (result.length >= 11) {
        result.pop();
        return { result, hasMore: true };
      }

      return { result, hasMore: false };
    } catch (e) {
      return { result: [], hasMore: false };
    }
  },
  async findMusicsBy(MIDS: number[]) {
    const result = await MusicModel.findAll({
      attribute: ['MID', 'name', 'singer', 'description', 'thumbnail', 'path'],
      where: {
        MID: {
          [Op.or]: MIDS,
        },
      },
    });

    return result.map(
      (res: Music): Music => ({
        MID: res.MID,
        name: res.name,
        singer: res.singer,
        description: res.description,
        thumbnail: res.thumbnail,
        path: res.path,
        isPlayed: false,
      }),
    );
  },
};
