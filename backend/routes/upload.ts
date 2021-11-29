import express from 'express';
import multer from 'multer';
import {makeHash} from '../utils/util'
import {uploadLogic} from'../services/upload'
const upload = multer({
    storage: multer.memoryStorage()
});
const router = express.Router();
const cpUpload = upload.fields([{name:'userFile1'}, {name:'userFile2'}])


router.post('/', cpUpload, async (req, res, next)=>{
    const bucket_name = 'sws';
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const object_name = `${files.userFile1[0].originalname}`;
    const contentHash = makeHash(files.userFile1[0].buffer.toString());
    const thumbnailName = object_name.split('.')[0]+'.'+files.userFile2[0].originalname.split('.')[1];
    const singer = req.body.singer;
    const description = req.body.description
    uploadLogic(bucket_name, files, object_name, contentHash, thumbnailName, singer, description);
    res.send(200);
})
export default router;