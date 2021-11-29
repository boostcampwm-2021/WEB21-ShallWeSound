import axios from 'axios';
import * as jwt from 'jsonwebtoken'
import {authCode} from '../types/index'
import {client, resultPrint, updateOrDeleteToken} from '../config/redis'
import {promisify} from 'util'
import {userProfileRequestHeader} from '../types/index'
const models = require('../models/index.js');

const makeOauthAccessToken = async (platform:string, cururl:string, curheaders:string)=>{
    if(platform === 'github'){
        return await await axios({
            method: `POST`,
            withCredentials: true,
            url: cururl,
            headers: {
            'content-type': curheaders,
            },
        })
    }else{
        return await await axios({
            method: `POST`,
            url: cururl,
            headers: {
            'content-type': curheaders,
            },
        })
    }
}


const getUserProfileFromOauth = async (platform:string, url:string, headers:userProfileRequestHeader) =>{
    if(platform === 'github'){
        return await axios({
            method:'GET',
            withCredentials:true,
            url: url,
            headers:{
                Authorization: headers.Authorization
            }
        })
    }else{
        return await axios({
            method:'POST',
            withCredentials:true,
            url: url,
            data:{
                property_keys: ["kakao_account.email"]
            },
            headers: {
            'Authorization': headers.Authorization,
            'content-type': headers.contentType!,
            },
        })
    }

}
const githubLoginService = async(code:authCode)=>{
    const tokenURL = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;
    const access_token = await makeOauthAccessToken('github', tokenURL, 'application/json');
    let access_token_split = access_token.data.split('&')[0].split('=')[1];
    const requestHeader:userProfileRequestHeader={
        Authorization:`token ${access_token_split}`,
        contentType:null
    }
    const userResponse = await getUserProfileFromOauth('github','https://api.github.com/user', requestHeader )
    const userID = userResponse.data.login;
    const userEmail = userResponse.data.email === null || userResponse.data.email === undefined ? '':userResponse.data.email;
    const aToken = jwt.sign({userID:userID, userEmail:userEmail}, `${process.env.SALT}`, {
    expiresIn: '30m'
    });
    const rToken = jwt.sign({}, `${process.env.SALT}`, {expiresIn:'2h'})
    searchOrCreate(userID, userEmail, 'github');
    client.set(aToken, rToken, resultPrint);
    return aToken;

}
const kakaoLoginService = async(code:authCode)=>{
    const tokenURL=`https://kauth.kakao.com/oauth/token?client_id=${process.env.KAKAO_CLIENT_KEY}&grant_type=authorization_code&redirect_uri=${process.env.KAKAO_CALLBACK_URL}&code=${code}`;
    const tokenObj = await makeOauthAccessToken('kakao', tokenURL, 'application/x-www-form-urlencoded');
    const accessToken = tokenObj.data.access_token;
    const requestHeader:userProfileRequestHeader={
        Authorization:`Bearer ${accessToken}`,
        contentType:'application/x-www-form-urlencoded'
    }
    const userResponse = await getUserProfileFromOauth('kakao','https://kapi.kakao.com/v2/user/me', requestHeader);
    const userID = userResponse.data.id;
    const curEmail = userResponse.data.kakao_account.email;
    const userEmail = curEmail === null || curEmail == undefined ? '' : curEmail;
    searchOrCreate(userID, userEmail, 'kakao');
    const aToken = jwt.sign({userID:userID, userEmail:userEmail},  `${process.env.SALT}`, {
        expiresIn: '30m'
        });
    const rToken = jwt.sign({}, `${process.env.SALT}`, {expiresIn:'2h'})
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
const getUserEmail = (obj:string|jwt.JwtPayload):string =>{
    if(typeof obj === 'string'){
        return obj;
    }else{
        return obj.userEmail;
    }
}


const IDsearchInDB = async(verifyResult:string|jwt.JwtPayload)=>{
    try{
        const DBresult = await models.USER.findAll({ID:getUserId(verifyResult)})
    }catch(DBerr){
        return false;
    }
    return true;
}

const makeReturnResultOfVerifyToken = (result:boolean, userID:string|null, userEmail:string|null, newToken:string|null) =>{
    return {
        result:result,
        userID:userID,
        userEmail:userEmail,
        newToken:newToken
    }
}
const verifyToken = async (accessToken:string) =>{
    try{
        const verifyResult = jwt.verify(accessToken, `${process.env.SALT}`);
        const DBsearchResult = await IDsearchInDB(verifyResult);
        if(DBsearchResult === false){
            return makeReturnResultOfVerifyToken(false, null, null, null);
        }
        return makeReturnResultOfVerifyToken(true, getUserId(verifyResult), getUserEmail(verifyResult), null);
    }catch(err){
        const refrashRes = await refrashToken(accessToken);
        if (refrashRes !== null){
            const DBsearchResult = await IDsearchInDB(`${refrashRes}`);
            if(DBsearchResult === true){
                return makeReturnResultOfVerifyToken(true, 
                    getUserId(jwt.verify(`${refrashRes}`, `${process.env.SALT}`)),
                    getUserEmail(jwt.verify(`${refrashRes}`, `${process.env.SALT}`)) ,
                    refrashRes);
            }else{
                return makeReturnResultOfVerifyToken(false, null, null, null);
            }
        }else{
            return makeReturnResultOfVerifyToken(false, null, null, null);
        }
    }
    
}

const redisGET = promisify(client.get).bind(client);
const refrashToken = async (accessToken:string)=>{
    const rToken = await redisGET(accessToken);
    try{
        const rTokenVerifyResult = jwt.verify(rToken!, `${process.env.SALT}`);
        const newToken = jwt.sign({userID:getUserId(jwt.decode(accessToken)!), userEmail:getUserEmail(jwt.decode(accessToken)!)}, 
        `${process.env.SALT}`, {expiresIn:'30m'});
        return newToken;
    }catch(err){
        return null
    }

}

const updateOrDelete = (token:string, updateToken:string|null, option:number) =>{
    updateOrDeleteToken(token, updateToken, option);
}

const searchOrCreate = (id:string, email:string, platform:string)=>{
    models.USER.findOrCreate({
        where: { ID:id, platform:platform },
        defaults: {
            ID:id,
            user_email:email,
            platform:platform
        }
    });
}
export const loginServie={
    githubLogin:githubLoginService,
    kakaoLogin:kakaoLoginService,
    verifyToken:verifyToken,
    updateOrDelete:updateOrDelete,
    getUserId:getUserId,
    getUserEmail:getUserEmail,
    searchOrCreate:searchOrCreate
}


