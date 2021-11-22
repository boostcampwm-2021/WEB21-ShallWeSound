import express from 'express';
import musicRouter from './music';
import roomRouter from './room';
import resultRouter from './result';

const router = express.Router();

router.use('/music', musicRouter);
router.use('/room', roomRouter);
router.use('/result', resultRouter);

export default router;
