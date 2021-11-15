import express from 'express';
import {S3, makeSignedURL} from '../utils/cloudConfig'
const router = express.Router();
router.use(express.json());

router.get('/' ,(req, res)=>{
    const contentHash = req.body.contentHash;
    const musicName = req.body.musicName;
    res.send(makeSignedURL(S3, contentHash, musicName));
})


export default router;