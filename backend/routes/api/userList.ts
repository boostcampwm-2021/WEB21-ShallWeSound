import express from 'express';
import { socketData } from '../../socket/userData';
import { utils } from '../../utils/util';

const router = express.Router();

router.get('/', (req, res, next) => {
  const roomTitle = `${req.query.roomTitle}`;
  const targetRoom = utils.findRoomOnTitle(socketData, roomTitle);
  const userList = targetRoom?.userId.filter((val, idx, arr) => arr.indexOf(val) === idx);
  if (!targetRoom) res.json({ list: ['bad'] });

  res.json({ list: userList });
});

export default router;
