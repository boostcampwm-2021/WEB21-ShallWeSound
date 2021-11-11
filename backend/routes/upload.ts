import express from 'express';
import multer from 'multer';
import * as AWS from 'aws-sdk';
import {Readable} from 'stream';
import {initDB, connect} from '../config/db';
import crypto from 'crypto';
import bodyParser from 'body-parser';
const db = initDB();
connect(db);
const upload = multer({
    storage: multer.memoryStorage()
});
const router = express.Router();
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
    const contentHash = makeHash(files.userFile1[0].buffer.toString());
    const thumbnailName = object_name.split('.')[0]+'.'+files.userFile2[0].originalname.split('.')[1];
    
    (async () => {
        await db.query(
            'INSERT INTO MUSIC (name, singer, description, thumbnail, path, content_hash) values (?,?,?,?,?,?)',
            [object_name, req.body.singer, req.body.description, thumbnailName, '경로경로', contentHash],
            async function(err, rows, fields){
                if(!err){
                    let folder_name = `${contentHash}/`;
                    // 해쉬값을 이름으로 하는 폴더를 생성하고, 그 안에 파일 업로드
                    await S3.putObject({
                        Bucket: bucket_name,
                        Key: folder_name
                    }).promise();
                    await Promise.all([
                        S3.upload({
                            Bucket: bucket_name,
                            Key: folder_name+object_name,
                            Body: Readable.from(files.userFile1[0].buffer)
                        }, options).promise(),
                        S3.upload({
                            Bucket: bucket_name,
                            Key: folder_name+thumbnailName,
                            Body: Readable.from(files.userFile2[0].buffer)
                        }, options).promise()
                    ])
                }
            }
        );
    })();
    res.send(200);
    
})
export default router;