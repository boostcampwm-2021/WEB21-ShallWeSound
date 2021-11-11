import express from 'express';
import { socketData } from '../socket/SocketHandler';
const router = express.Router();

router.get('/room', (req: express.Request, res: express.Response) => {
  console.log('통신이 온다');
  console.log(socketData);
  const data = socketData.map(val => {
    return { id: val.id, name: val.name, description: val.description };
  });
  res.json({ list: data });
});

export default router;
