import React, {useState, useEffect} from 'react';
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
  // const cookieLogin = async (cookie) => {
  //   if (cookie !== null && cookie !== undefined) {
  //     const result = await fetch("/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json;charset=utf-8",
  //       },
  //       body: JSON.stringify({
  //         jwt: cookie,
  //       }),
  //     });
  //     const idJson = await result.json();
  //     setId(idJson.id);
  //     return idJson;
  //   }
  // };
  useEffect(()=>{
    if(jwt === null){
      cookies.remove("jwt")
      history.push("/");
    }
  }, [jwt])


  const isAuthenticated = () => {
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
        console.log(
          res
        )
        setAuthenticate(res.isOK);
      })
    }
  };

  return (
    <>
      <Router>
        <Route
          path="/login"
          render={()=>{
            const result = isAuthenticated();
            if(!authenticate){
              return <Route component={LoginPage} />;
            }else{
              return <Redirect to={{ pathname: "/" }} />;
            }
          }}
        />
        <Route
        path="/"
        render={()=>{
          const result = isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/login" }} />;
          }else{
            return <Redirect to={{ pathname: "/main" }} />;
          }
        }}
        />
        <Route
        path="/main"
        render={()=>{
          const result = isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/" }} />;
          }else{
            return <Route component={MainPage} />;
          }
        }}
        />
        <Route 
        path="/room" 
        render={()=>{
          const result =isAuthenticated();
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
          const result = isAuthenticated();
          if(!authenticate){
            return <Redirect to={{ pathname: "/" }}/>;
          }else{
            return <Route component={ResultPage} />;
          }
        }}
        />
      </Router>
      ,
    </>
  );
}

export default App;
