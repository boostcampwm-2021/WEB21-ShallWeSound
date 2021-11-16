import express from 'express';
import { socketData } from '../../socket/SocketHandler';
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const router = express.Router();

router.use(express.json());
router.use(
  session({
    secret: 'asdasd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new FileStore({ logFn: function () {} }),
  }),
);

router.get('/', (req: express.Request, res: express.Response) => {
  const data = socketData.map(val => {
    return { id: val.id, name: val.name, description: val.description };
  });
  res.json({ list: data });
});

router.get('/entering', (req: any, res: any) => {
  console.log(req.query.title);

  if (req.session.isEnterd === undefined) {
    req.session.isEnterd = true;
    res.json({ state: '하이요' });
  } else if (req.session.isEnterd) {
    res.json({ state: true });
  }
});

router.get('/entered', (req: any, res: any) => {
  console.log('여기 오나요?');
  res.json({ test: '옛다 응답' });
});

router.get('/destroy', (req: any, res: any) => {
  req.session.destroy(() => {
    console.log('파괴했냐?');
  });

  res.json({ test: '파괴완료' });
});

export default router;
