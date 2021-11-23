import express from 'express';
import {loginServie} from '../services/login'
import * as jwt from 'jsonwebtoken'
const router = express.Router();
router.use(express.json());
router.get('/kakao' ,(req, res)=>{
    res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_KEY}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}&response_type=code`)

})
router.get("/github", (req, res)=>{
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}`)
})

router.get('/github/callback', async (req, res)=>{
    const { code } = req.query;
    const token = await loginServie.githubLogin(code);
    res.cookie('userID', loginServie.getUserId( jwt.verify(token, `${process.env.SALT}`)))
    res.cookie('jwt', token).redirect('http://localhost:3001/');

})

router.get('/kakao/callback' , async (req, res)=>{
    const token = await loginServie.kakaoLogin(req.query.code);
    res.cookie('userID', loginServie.getUserId( jwt.verify(token, `${process.env.SALT}`)))
    res.cookie('jwt', token).redirect('http://localhost:3001/');
})

router.get('/authenticate', async (req, res)=>{
    const curToken = req.body.jwt;
    const authenticateResult = await loginServie.verifyToken(curToken);
    if(authenticateResult.result === true){
        if(authenticateResult.newToken === null){
            res.send(200);
        }else{
            loginServie.updateOrDelete(curToken, authenticateResult.newToken, 1);
            res.cookie('jwt', authenticateResult.newToken);
            res.cookie('userID', authenticateResult.userID);
            res.send(200);
        }
    }else{
        loginServie.updateOrDelete(curToken, null, 2);
        res.cookie('jwt', null);
        res.cookie('userID', null);
        res.send(200);
    }
})
const getUserId = (obj:string|jwt.JwtPayload):string =>{
    if(typeof obj === 'string'){
        return obj;
    }else{
        return obj.test;
    }
}
router.get('/verifyTest', (req, res)=>{
    const tempToken = jwt.sign({test:'test'}, 'salt', {expiresIn:'1m'});
    setTimeout(() => {
        res.send(getUserId(jwt.verify(`${tempToken}`, 'salt')));
    }, 2000);
})



export default router;