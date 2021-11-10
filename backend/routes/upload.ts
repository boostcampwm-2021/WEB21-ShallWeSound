import express from 'express';
import multer from 'multer';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
require('dotenv').config({path:'../config/.env'});
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
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

router.post('/', upload.single('userFile'),(req, res)=>{
    const bucket_name = 'sws';
    const object_name = `${req.file?.filename}`;
    let options = {
        partSize: 5 * 1024 * 1024
    };

    (async () => {
        await S3.upload({
            Bucket: bucket_name,
            Key: object_name,
            Body: fs.createReadStream(`./uploads/${req.file?.filename}`)
        }, options).promise();
        await fs.unlink(`./uploads/${req.file?.filename}`, err=>{});
    })();
    res.send(200);
})
export default router;