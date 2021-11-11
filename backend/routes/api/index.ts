import express from 'express';
import musicRouter from './music';

const router = express.Router();

router.use('/music', musicRouter);

export default router;
