import {myS3, makeSignedURL} from '../utils/cloudConfig'
import {Readable} from 'stream';
const models = require('../models/index.js');

const options = {
    partSize: 15 * 1024 * 1024
};

const uploadToStorage = async(
    S3:AWS.S3, 
    objectName:string, 
    bucketName:string, 
    files:{[fieldname: string]: Express.Multer.File[];},
    contentHash:string,
    thumbnailName:string
    )=>{
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

export const uploadLogic = async (
    bucket_name:string, 
    files:{[fieldname: string]: Express.Multer.File[];}, 
    object_name:string, 
    contentHash:string, 
    thumbnailName:string,
    singer:string,
    description:string
    )=>{
        try{
            const queryResult = await models.MUSIC.create({
                name:object_name, 
                singer:singer,
                description:description,
                thumbnail:thumbnailName,
                path:'경로경로',
                content_hash:contentHash});
            await uploadToStorage(myS3, object_name, bucket_name, files, contentHash, thumbnailName);
            const path = makeSignedURL(myS3, contentHash, object_name);
            const thumbnailPath = makeSignedURL(myS3, contentHash, thumbnailName);
            await queryResult.update({path:path, thumbnail:thumbnailPath});

        }catch(e){
            console.log(e);
        }
}
