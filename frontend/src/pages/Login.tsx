import '../stylesheets/login.scss';
import config from '../config.host.json';
const LoginPage = () => {
  const kakaoLogin = async () => {
    window.location.href = `${config.localhost}/oauth/kakao`;
  };
  const githubLogin = async () => {
    window.location.href = `${config.localhost}/oauth/github`;
  };
  return (
    <>
      <img className="header-logo" src="/images/logo.png" alt="logo" />
      <div className={'loginBox'}>
        <div className={'loginText'}>그 노래, 같이 들어요!</div>
        <div className={'Btn'} onClick={githubLogin}>
          <img src="/images/GitHub-Mark-120px-plus.png" />
          <div>github login</div>
        </div>
        <div className="Btn" onClick={kakaoLogin}>
          <img src="/images/kakao.png" />
          <div>kakao login</div>
        </div>
      </div>
    </>
  );
};

export { LoginPage };
