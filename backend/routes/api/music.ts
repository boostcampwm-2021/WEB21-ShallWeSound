import express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  const keyword = req.query.keyword;
  console.log(keyword);

  if (keyword === '') {
    res.send([
      {
        MID: '1',
        name: '스트로베리문',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '아이유',
        description: '딸기딸기딸기',
        path: '서버 음악 저장 경로',
      },
    ]);
  } else {
    res.send([
      {
        MID: '음악 id (MID)',
        name: '곡명',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '가수',
        description: '곡 설명',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '음악 id (MID)',
        name: '곡명',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '가수',
        description: '곡 설명',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '음악 id (MID)',
        name: '곡명',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '가수',
        description: '곡 설명',
        path: '서버 음악 저장 경로',
      },
      {
        MID: '음악 id (MID)',
        name: '곡명',
        thumbnail: '서버 썸네일 저장 경로',
        singer: '가수',
        description: '곡 설명',
        path: '서버 음악 저장 경로',
      },
    ]);
  }
});

export default router;
