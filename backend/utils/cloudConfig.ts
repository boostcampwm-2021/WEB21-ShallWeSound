import * as AWS from 'aws-sdk';
const region = 'kr-standard';
const access_key = `${process.env.ACCESS_KEY}`;
const secret_key = `${process.env.SECRET_KEY}`;
export const myS3 = new AWS.S3({
    endpoint:'https://kr.object.ncloudstorage.com',
    region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});

export const makeSignedURL = (S3:AWS.S3, contentHash:string, musicName:string):string =>{
    const params = {Bucket: 'sws', Key: `${contentHash}/${musicName}`, Expires: 5000000};
    return S3.getSignedUrl('getObject', params);
}