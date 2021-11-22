import axios from 'axios';
import * as jwt from 'jsonwebtoken'
import {authCode} from '../types/index'

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
    const token = jwt.sign({
    userID: userID
    }, `${process.env.SALT}`, {
    expiresIn: '1h'
    });
    return token;

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
    const token = jwt.sign({
        userID: userID
        }, `${process.env.SALT}`, {
        expiresIn: '1h'
        });
    return token;
}

export const loginServie={
    githubLogin:githubLoginService,
    kakaoLogin:kakaoLoginService
}