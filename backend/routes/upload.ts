import express from 'express';
import multer from 'multer';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import {Readable} from 'stream';
import {db, connect} from '../config/db'
const upload = multer({
    // storage: multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/');
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.originalname);
    //     }
    // }),
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
const cpUpload = upload.fields([{name:'userFile1'}, {name:'userFile2'}])
router.post('/', cpUpload,(req, res, next)=>{
    const bucket_name = 'sws';
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const object_name = `${files.userFile1[0].originalname}`;
    let options = {
        partSize: 5 * 1024 * 1024
    };

    (async () => {
        await S3.upload({
            Bucket: bucket_name,
            Key: object_name,
            // Body: fs.createReadStream(`./uploads/${req.file?.filename}`)
            Body: Readable.from(files.userFile1[0].buffer)
        }, options).promise();
        const thumbnailName = object_name.split('.')[0]+'.'+files.userFile2[0].originalname.split('.')[1];
        await S3.upload({
            Bucket: bucket_name,
            Key: thumbnailName,
            // Body: fs.createReadStream(`./uploads/${req.file?.filename}`)
            Body: Readable.from(files.userFile2[0].buffer)
        }, options).promise();
        // await fs.unlink(`./uploads/${req.file?.filename}`, err=>{});
    })();
    res.send(200);
})
export default router;