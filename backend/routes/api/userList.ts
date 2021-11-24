import express from 'express';
import { socketData } from '../../socket/userData';
import { utils } from '../../utils/util';

const router = express.Router();

router.get('/', (req, res, next) => {
  const roomTitle = `${req.query.roomTitle}`;
  console.log('방제목', roomTitle);
  const targetRoom = utils.findRoomOnTitle(socketData, roomTitle);
  console.log(targetRoom);
  res.json({ list: targetRoom?.socketId });
});

export default router;
