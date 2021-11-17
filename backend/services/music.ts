import { Sequelize } from 'sequelize';
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
      where: Sequelize.literal(`MATCH (name, singer) AGAINST ('*':keyword'*' in boolean mode)`),
      replacements: {
        keyword: keyword,
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
      (res: {
        MID: number;
        name: string;
        singer: string;
        description: string;
        thumbnail: string;
        path: string;
      }): Music => ({
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
