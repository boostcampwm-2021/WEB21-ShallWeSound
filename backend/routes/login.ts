import express from 'express';
import {loginServie} from '../services/login'
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
    const token = loginServie.githubLogin(code);
    res.cookie('jwt', token).redirect('http://localhost:3001/');
})

router.get('/kakao/callback' , async (req, res)=>{
    const token = loginServie.kakaoLogin(req.query.code);
    res.cookie('jwt', token).redirect('http://localhost:3001/');
})




export default router;