import express from 'express';
import musicRouter from './music';
import roomRouter from './room';

const router = express.Router();

router.use('/music', musicRouter);
router.use('/room', roomRouter);

export default router;
