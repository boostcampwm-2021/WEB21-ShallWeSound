import express from 'express';
import MusicService from '../../services/music';

interface aaa {
  name: string;
}

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response, next) => {
  const result = await MusicService.search(`${req.query.keyword}`);

  // const musicList = result.map(val => {
  //   return { name: val.name };
  // });

  res.json({ test: result });
});

export default router;
