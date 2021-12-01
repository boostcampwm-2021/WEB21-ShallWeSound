import { useState } from 'react';
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
  const [jwt, setJwt] = useState(cookies.get('jwt'));
  const [authenticate, setAuthenticate] = useState(false);
  function isAuthenticated() {
    if (!jwt || jwt === undefined) {
      return false;
    } else {
      fetch(`${config.localhost}/oauth/authenticate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: cookies.get('jwt') }),
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (authenticate != res.isOK) {
            setAuthenticate(res.isOK);
          }
        });
      return true;
    }
  }

  return (
    <>
      <Router>
      {isAuthenticated()}
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
