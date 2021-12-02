import { useState, useEffect} from 'react';
import { Room } from '../pages/Room';
import { MainPage } from '../pages/Main';
import { ResultPage } from '../pages/Result';
import { LoginPage } from '../pages/Login';
import '../stylesheets/reset.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import config from '../config.host.json';
import HeaderComponent from '../components/Header/Header';

function App() {
  const cookies = new Cookies();
  const [jwt, ] = useState(cookies.get('jwt'));
  const [authenticate, setAuthenticate] = useState(false);

  const authAsync= async()=>{
    if (!jwt || jwt === undefined) {
      return false;
    }else{
      const result = await fetch(`${config.localhost}/oauth/authenticate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: cookies.get('jwt') }),
      })
      const authenticateResponse = await result.json();
      if(authenticate != authenticateResponse.isOK){
        setAuthenticate(authenticateResponse.isOK);
      }
      return true;
    }

  }
  useEffect(() => {
    (async()=>{
      await authAsync();
    })()
  }, [])

  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            render={() => {
              if (!authenticate) {
                return <LoginPage />;
              } else {
                return <Redirect to={{ pathname: '/main' }} />;
              }
            }}
          />
          <>
            <HeaderComponent />
            <Route
              exact
              path="/"
              render={() => {
                if (!authenticate) {
                  return <Redirect to={{ pathname: '/login' }} />;
                } else {
                  return <Redirect to={{ pathname: '/main' }} />;
                }
              }}
            />
            <Route
              exact
              path="/main"
              render={() => {
                if (!authenticate) {
                  return <Redirect to={{ pathname: '/' }} />;
                } else {
                  return <Route component={MainPage} />;
                }
              }}
            />
            <Route
              path="/room"
              render={() => {
                if (!authenticate) {
                  return <Redirect to={{ pathname: '/' }} />;
                } else {
                  return <Route component={Room} />;
                }
              }}
            />
            <Route
              path="/result"
              render={() => {
                if (!authenticate) {
                  return <Redirect to={{ pathname: '/' }} />;
                } else {
                  return <Route component={ResultPage} />;
                }
              }}
            />
          </>
        </Switch>
      </Router>
    </>
  );
}

export default App;
