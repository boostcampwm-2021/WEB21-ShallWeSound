import express from 'express';
import multer from 'multer';
import * as AWS from 'aws-sdk';
import {Readable} from 'stream';
import {initDB, connect} from '../config/db'
import crypto from 'crypto'
const db = initDB();
connect(db);
const upload = multer({
    storage: multer.memoryStorage()
});
const router = express.Router();
const region = 'kr-standard';
const access_key = `${process.env.ACCESS_KEY}`;
const secret_key = `${process.env.SECRET_KEY}`;
console.log(access_key, secret_key)
const S3 = new AWS.S3({
    endpoint:'https://kr.object.ncloudstorage.com',
    region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});
function makeHash(fileBuffer:string):string{
    return crypto.createHash('sha512').update(fileBuffer + `${process.env.SALT}`).digest('hex');
}
const cpUpload = upload.fields([{name:'userFile1'}, {name:'userFile2'}])
router.post('/', cpUpload,(req, res, next)=>{
    const bucket_name = 'sws';
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const object_name = `${files.userFile1[0].originalname}`;
    let options = {
        partSize: 5 * 1024 * 1024
    };
    const contentHash = makeHash(files.userFile1[0].toString());
    (async () => {
        await S3.upload({
            Bucket: bucket_name,
            Key: object_name,
            Body: Readable.from(files.userFile1[0].buffer)
        }, options).promise();
        const thumbnailName = object_name.split('.')[0]+'.'+files.userFile2[0].originalname.split('.')[1];
        await S3.upload({
            Bucket: bucket_name,
            Key: thumbnailName,
            Body: Readable.from(files.userFile2[0].buffer)
        }, options).promise();
        db.query(
            'INSERT INTO MUSIC (name, singer, description, thumbnail, path, content_hash) values (?,?,?,?,?,?)',
            [object_name, '기범기범', '설명설명', thumbnailName, '경로경로', contentHash],
            function(err, rows, fields){
                if(err) res.send(500);
            }
        )
    })();
    res.send(200);
})
export default router;