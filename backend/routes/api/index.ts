import express from 'express';
import musicRouter from './music';
import roomRouter from './room';
import resultRouter from './result';
import userListRouter from './userList';
const router = express.Router();

router.use('/music', musicRouter);
router.use('/room', roomRouter);
router.use('/result', resultRouter);
router.use('/userList', userListRouter);
export default router;
