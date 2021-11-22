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
    if (!jwt || jwt === undefined) return false;
    return true;
  };

  return (
    <>
      <Router>
        <Route
          path="/login"
          render={()=>{
            console.log(isAuthenticated());
            if(!isAuthenticated()){
              return <Route component={LoginPage} />;
            }else{
              return <Redirect to={{ pathname: "/" }} />;
            }
          }}
        />
        <Route
        path="/"
        render={()=>{
          console.log(isAuthenticated());
          if(!isAuthenticated()){
            return <Redirect to={{ pathname: "/login" }} />;
          }else{
            return <Redirect to={{ pathname: "/main" }} />;
          }
        }}
        />
        <Route
        path="/main"
        render={()=>{
          console.log(isAuthenticated());
          if(!isAuthenticated()){
            return <Redirect to={{ pathname: "/" }} />;
          }else{
            return <Route component={MainPage} />;
          }
        }}
        />
        <Route 
        path="/room" 
        render={()=>{
          if(!isAuthenticated()){
            return <Redirect to={{ pathname: "/" }}/>;
          }else{
            return <Route component={Room} />;
          }
        }}
        />
        <Route 
        path="/result" 
        render={()=>{
          if(!isAuthenticated()){
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
