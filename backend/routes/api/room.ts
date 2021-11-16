import express from 'express';
import { socketData } from '../../socket/SocketHandler';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  const data = socketData.map(val => {
    return { id: val.id, name: val.name, description: val.description };
  });
  res.json({ list: data });
});

export default router;
