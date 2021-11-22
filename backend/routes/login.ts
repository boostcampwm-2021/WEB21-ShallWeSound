import express from 'express';
import axios from 'axios';
import * as jwt from 'jsonwebtoken'
import qs from 'qs'
const router = express.Router();
router.use(express.json());

router.get('/kakao' ,(req, res)=>{
    console.log("리다이렉트 하자!")
    res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_KEY}&redirect_uri=http://localhost:3000/oauth&response_type=code`)

})

router.get('/kakao/callback' , async (req, res)=>{
    console.log('토큰 얻어오자!')
    const code = req.query.code;
    const tokenObj = await axios({
        method: 'POST',
        url: `https://kauth.kakao.com/oauth/token?client_id=${process.env.KAKAO_CLIENT_KEY}&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth&code=${code}`,
        headers: {
        'content-type': 'application/x-www-form-urlencoded',
        },
    })
    const accessToken = tokenObj.data.access_token;
    
    console.log('정보 얻어오자!', accessToken)
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
    // const userEmail = userResponse.data.kakao_account.email;
    console.log('쿠키 생성하자!', userID, userResponse.data)
    const token = jwt.sign({
        userID: userID
        }, `${process.env.SALT}`, {
        expiresIn: '1h'
        });
    res.cookie('jwt', token).redirect('http://localhost:3001/');
})


export default router;