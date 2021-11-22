import express from 'express';
import { socketData } from '../../socket/userData';
import { utils } from '../../utils/util';

const router = express.Router();

router.get('/', (req, res, next) => {
  const roomTitle = `${req.query.roomTitle}`;
  const targetRoom = utils.findRoomOnTitle(socketData, roomTitle);
  res.json({ list: targetRoom?.socketId });
});

export default router;
