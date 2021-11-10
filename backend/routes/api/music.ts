import express from 'express';
import MusicService from '../../services/music';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const keyword = (req.query.keyword as string) ?? '';

  if (keyword === '') {
    res.send([
      {
        MID: '222222222',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '333333333',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '44444444',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '555555555',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '666666666',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '77777777',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '88888888',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '99999999',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '000000000',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '123123123',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '12423154',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '3456345634',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '4567456754',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '567856786',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '4674567',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '865785679',
        name: '독하다독해 gogogogo12312312(feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더더더더더더더덛더더더더더더더더aaaaa더더더더...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '78907890',
        name: '독하다독해 (feat: 호눅스)',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '크롱',
        description: '독하다독해 요구 사항 하나 더 ...',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '3459057',
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
