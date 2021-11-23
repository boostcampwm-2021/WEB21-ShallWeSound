import axios from 'axios';
import * as jwt from 'jsonwebtoken'
import {authCode} from '../types/index'
import {client, resultPrint, updateOrDeleteToken} from '../config/redis'
import {promisify} from 'util'
const githubLoginService = async(code:authCode)=>{
    const access_token = await axios({
        method: 'POST',
        url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
        headers: {
        'content-type': 'application/json',
        },
    })
    let access_token_split = access_token.data.split('&')[0].split('=')[1];
    const userResponse = await axios({
        method: 'GET',
        url: 'https://api.github.com/user',
        headers: {
        Authorization: `token ${access_token_split}`,
        },
    });
    const userID = userResponse.data.login;
    const userEmail = userResponse.data.email;
    const aToken = jwt.sign({userID:userID}, `${process.env.SALT}`, {
    expiresIn: '30m'
    });
    const rToken = jwt.sign({}, `${process.env.SALT}`, {expiresIn:'1h'})
    client.set(aToken, rToken, resultPrint);
    return aToken;

}
const kakaoLoginService = async(code:authCode)=>{
    const tokenObj = await axios({
        method: 'POST',
        url: `https://kauth.kakao.com/oauth/token?client_id=${process.env.KAKAO_CLIENT_KEY}&grant_type=authorization_code&redirect_uri=${process.env.KAKAO_CALLBACK_URL}&code=${code}`,
        headers: {
        'content-type': 'application/x-www-form-urlencoded',
        },
    })
    const accessToken = tokenObj.data.access_token;
    const userResponse = await axios({
        method: 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        data:{
            property_keys: ["kakao_account.email"]
        },
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'content-type': 'application/x-www-form-urlencoded',
        },
    });
    const userID = userResponse.data.id;
    const aToken = jwt.sign({userID:userID},  `${process.env.SALT}`, {
        expiresIn: '30m'
        });
    const rToken = jwt.sign({}, `${process.env.SALT}`, {expiresIn:'1h'})
    client.set(aToken, rToken, resultPrint);

    return aToken;
}

const getUserId = (obj:string|jwt.JwtPayload):string =>{
    if(typeof obj === 'string'){
        return obj;
    }else{
        return obj.userID;
    }
}

const verifyToken = async (accessToken:string) =>{
    try{
        const verifyResult = jwt.verify(accessToken, `${process.env.SALT}`);
        const returnResult= {
            result:true,
            userID:getUserId(verifyResult),
            newToken:null
        }
        return returnResult
    }catch(err){
        const refrashRes = await refrashToken(accessToken);
        if (refrashRes !== null){
            const returnResult={
                result:true,
                userID:getUserId(jwt.verify(`${refrashRes}`, `${process.env.SALT}`)) ,
                newToken:refrashRes
            }
            return returnResult
        }else{
            const returnResult={
                result:false,
                userID:null,
                newToken:null
            }
            return returnResult
        }
    }
    
}

const redisGET = promisify(client.get).bind(client);
const refrashToken = async (accessToken:string)=>{
    const rToken = await redisGET(accessToken);
    try{
        const rTokenVerifyResult = jwt.verify(rToken!, `${process.env.SALT}`);
        const newToken = jwt.sign({userID:jwt.verify(accessToken, `${process.env.SALT}`)}, 
        `${process.env.SALT}`, {expiresIn:'30m'});
        return newToken;
    }catch(err){
        return null
    }

}

const updateOrDelete = (token:string, updateToken:string|null, option:number) =>{
    updateOrDeleteToken(token, updateToken, option);
}
export const loginServie={
    githubLogin:githubLoginService,
    kakaoLogin:kakaoLoginService,
    verifyToken:verifyToken,
    updateOrDelete:updateOrDelete,
    getUserId:getUserId
}


