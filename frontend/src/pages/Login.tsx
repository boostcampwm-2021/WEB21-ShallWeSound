import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { musicResultItem } from '../types';

const LoginPage = ({ history }: { history: RouteComponentProps['history'] }) => {
    const kakaoLogin = ()=>{
        console.log('카카오로그인')
        window.location.href='http://localhost:3000/oauth/kakao';
    }
    const googleLogin = () =>{
        window.location.href='http://localhost:3000/oauth/google';
    }
    return(
        <div>
            <div onClick={googleLogin}><img src="images/btn_google_signin_light_normal_web.png"></img> </div>
            <div onClick={kakaoLogin}><img src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg" /> </div>
        </div>
    )
};

export { LoginPage };
