import express from 'express';
import MusicService from '../../services/music';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const keyword = (req.query.keyword as string) ?? '';
  const page = parseInt(req.query.page as string);

  if (keyword === '') {
    res.send([]);
  } else {
    const result = await MusicService.searchByPage(keyword, page);
    res.send(result);
  }
});

export default router;
