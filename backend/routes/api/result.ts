import express from 'express';
import MusicService from '../../services/music';
import { musicTable } from '../../types';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response, next) => {
  const result: musicTable[] = await MusicService.search(`${req.query.keyword}`);
  const musicList = result.map(val => {
    return { name: val.name, singer: val.singer, thumbnail: val.thumbnail };
  });

  res.json({ list: musicList });
});

export default router;
