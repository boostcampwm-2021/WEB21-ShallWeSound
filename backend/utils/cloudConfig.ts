import * as AWS from 'aws-sdk';
const region = 'kr-standard';
const access_key = `${process.env.ACCESS_KEY}`;
const secret_key = `${process.env.SECRET_KEY}`;
export const S3 = new AWS.S3({
    endpoint:'https://kr.object.ncloudstorage.com',
    region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});