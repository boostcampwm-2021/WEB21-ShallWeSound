import express from 'express';
import { EmptyResultError } from 'sequelize/types';
import { socketData } from '../../socket/SocketHandler';
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const router = express.Router();

const option = {
  host: '101.101.209.122',
  port: 3306,
  user: 'web21',
  password: 'password',
  database: 'SWS',
};

const sessionStore = new MySQLStore(option);

router.use(express.json());
router.use(
  session({
    secret: 'asdasd',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: sessionStore,
  }),
);

router.get('/', (req: express.Request, res: express.Response) => {
  const data = socketData.map(val => {
    return { id: val.id, name: val.name, description: val.description, totalUser: val.socketId.length };
  });
  res.json({ list: data });
});

router.get('/entering', (req: any, res: any) => {
  console.log(req.query.title);

  if (req.session.isEntered === undefined) {
    req.session.isEntered = true;
    req.session.roomTitle = req.query.title;
    res.json({ state: '하이요' });
  } else if (req.session.isEntered) {
    res.json({ state: true });
  }
});

router.get('/entered', (req: any, res: any) => {
  console.log('여기 오나요?');
  res.json({ test: req.session.isEntered, roomTitle: req.session.roomTitle });
});

router.get('/destroy', (req: any, res: any) => {
  req.session.destroy(() => {
    console.log('파괴했냐?');
  });

  res.clearCookie('connect.sid');

  res.json({ test: '파괴완료' });
});

export default router;
