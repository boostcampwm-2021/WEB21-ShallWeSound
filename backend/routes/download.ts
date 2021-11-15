import express from 'express';
import * as AWS from 'aws-sdk';
const router = express.Router();
router.use(express.json());
const region = 'kr-standard';
const access_key = `${process.env.ACCESS_KEY}`;
const secret_key = `${process.env.SECRET_KEY}`;
const S3 = new AWS.S3({
    endpoint:'https://kr.object.ncloudstorage.com',
    region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});

router.get('/' ,(req, res)=>{
    const contentHash = req.body.contentHash;
    const musicName = req.body.musicName;
    var params = {Bucket: 'sws', Key: `${contentHash}/${musicName}`};
    var url = S3.getSignedUrl('getObject', params);
    res.send(url);

})

export default router;