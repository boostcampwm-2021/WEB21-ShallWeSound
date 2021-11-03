import express from 'express';
import fs from 'fs';
import path from 'path';
const router = express.Router();

router.get('/:name', (req: express.Request, res: express.Response) => {
  const music = req.params.name;

  const data = fs.readFileSync(path.resolve(__dirname, `../audio/${music}`));
  res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
  res.write(data);
  res.end();
});

export default router;
