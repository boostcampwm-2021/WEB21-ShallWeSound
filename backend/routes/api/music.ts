import express from 'express';
import MusicService from '../../services/music';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const keyword = (req.query.keyword as string) ?? '';

  if (keyword === '') {
    res.send([
      {
        MID: '1',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '2',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
    ]);
  } else {
    const result = await MusicService.search(keyword);
    res.send(result);
  }
});

export default router;
