import express from 'express';
import {S3} from '../utils/cloudConfig'
const router = express.Router();
router.use(express.json());

router.get('/' ,(req, res)=>{
    const contentHash = req.body.contentHash;
    const musicName = req.body.musicName;
    res.send(makeSignedURL(contentHash, musicName));
})

const makeSignedURL = (contentHash:String, musicName:String):string =>{
    const params = {Bucket: 'sws', Key: `${contentHash}/${musicName}`};
    const url = S3.getSignedUrl('getObject', params);
    return url;
}

export default router;