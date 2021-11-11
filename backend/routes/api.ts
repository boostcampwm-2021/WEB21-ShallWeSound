import express from 'express';
import { socketData } from '../socket/SocketHandler';
const router = express.Router();

router.get('/room', (req: express.Request, res: express.Response) => {
  console.log('통신이 온다');
  console.log(socketData);
  const roomList: string[] = socketData.map(val => val.title);
  res.json({ list: roomList });
});

export default router;
