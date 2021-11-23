import React, {useState, useEffect, useMemo} from 'react';
import { Room } from '../pages/Room';
import { MainPage } from '../pages/Main';
import { ResultPage } from '../pages/Result';
import { LoginPage } from '../pages/Login';
import '../stylesheets/reset.css';
import styles from '../stylesheets/style.module.scss';
import HeaderComponent from './Header/Header';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter as Router, Route, useHistory, Redirect } from 'react-router-dom';
import {Cookies} from 'react-cookie';

function App() {
  const history = useHistory();
  const cookies = new Cookies();
  const [jwt, setJwt] = useState(cookies.get('jwt'));
  const [authenticate, setAuthenticate] = useState(false);

  function isAuthenticated() {
    if (!jwt || jwt === undefined){
      return false;
    }else{
      fetch('/oauth/authenticate', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        body:JSON.stringify({jwt:cookies.get('jwt')})
      }).then(res=>{
        return res.json()
      }).then(res=>{
        if(authenticate != res.isOK){
          setAuthenticate(res.isOK);
        }
      })
    }
  };

  return (
    <>
      <Router>
        <Route
          exact path="/login"
          render={()=>{
            if(!authenticate){
              return <LoginPage/>;
            }else{
              return <Redirect to={{ pathname: "/main" }} />;
            }
          }}
        />
        <Route
        exact path="/"
        render={()=>{
          isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/login" }} />;
          }else{
            return <Redirect to={{ pathname: "/main" }} />;
          }
        }}
        />
        <Route
        exact path="/main"
        render={()=>{
          isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/" }} />;
          }else{
            return <Route path='/main'component={MainPage} />;
          }
        }}
        />
        <Route 
        path="/room" 
        render={()=>{
          isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/" }}/>;
          }else{
            return <Route component={Room} />;
          }
        }}
        />
        <Route 
        path="/result" 
        render={()=>{
          isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/" }}/>;
          }else{
            return <Route component={ResultPage} />;
          }
        }}
        />
      </Router>
    </>
  );
}

export default App;
