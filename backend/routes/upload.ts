import express from 'express';
import multer from 'multer';
import {S3, makeSignedURL} from '../utils/cloudConfig'
import {Readable} from 'stream';
import {makeHash} from '../utils/util'
const models = require('../models/index.js');
const upload = multer({
    storage: multer.memoryStorage()
});
const router = express.Router();
const cpUpload = upload.fields([{name:'userFile1'}, {name:'userFile2'}])
let options = {
    partSize: 5 * 1024 * 1024
};
async function uploadToStorage (
    S3:AWS.S3, 
    objectName:string, 
    bucketName:string, 
    files:{[fieldname: string]: Express.Multer.File[];},
    contentHash:string,
    thumbnailName:string
    ){
        let folder_name = `${contentHash}/`;
        // 해쉬값을 이름으로 하는 폴더를 생성하고, 그 안에 파일 업로드
        await S3.putObject({
            Bucket: bucketName,
            Key: folder_name
        }).promise();
        await Promise.all([
            S3.upload({
                Bucket: bucketName,
                Key: folder_name+objectName,
                Body: Readable.from(files.userFile1[0].buffer)
            }, options).promise(),
            S3.upload({
                Bucket: bucketName,
                Key: folder_name+thumbnailName,
                Body: Readable.from(files.userFile2[0].buffer)
            }, options).promise()
        ])
}


router.post('/', cpUpload, async (req, res, next)=>{
    const bucket_name = 'sws';
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const object_name = `${files.userFile1[0].originalname}`;
    
    const contentHash = makeHash(files.userFile1[0].buffer.toString());
    const thumbnailName = object_name.split('.')[0]+'.'+files.userFile2[0].originalname.split('.')[1];
    // const path = makeSignedURL(S3, contentHash, object_name);
    try{
        const queryReuslt = await models.MUSIC.create({
            name:object_name, 
            singer:req.body.singer,
            description:req.body.description,
            thumbnail:thumbnailName,
            path:'경로경로',
            content_hash:contentHash});
        await uploadToStorage(S3, object_name, bucket_name, files, contentHash, thumbnailName);
        const path = makeSignedURL(S3, contentHash, object_name);
        await queryReuslt.update({path:path});
    }catch(e){
        console.log(e);
    }
    
    
    res.send(200);
    
})
export default router;