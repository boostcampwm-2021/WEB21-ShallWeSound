import  '../stylesheets/login.scss'

const LoginPage = () => {
    const kakaoLogin = async ()=>{ 
       const data = await fetch('http://49.50.166.128:3000/oauth/github',{
		     credentials :'include',
                     }).then(res=>res.json());
       console.log('print: ', data);
    }
    const githubLogin = async () =>{
     window.location.href='https://shallwesound.p-e.kr/oauth/github';
    }
    return(
        <>
        <img className="header-logo" src="/images/logo.png" alt="logo" />
        <div className={"loginBox"}>
            <div className={"loginText"}>그 노래, 같이 들어요!</div>
            <div className={'Btn'} onClick={githubLogin}>
                <img src="/images/GitHub-Mark-120px-plus.png" />
                <div>github login</div>
            </div>
            <div className='Btn' onClick={kakaoLogin}> 
                <img src="/images/kakao.png"/>
                <div>kakao login</div>
            </div>
        </div>
        </>
    )
};

export { LoginPage };
