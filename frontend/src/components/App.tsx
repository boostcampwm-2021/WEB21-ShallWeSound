import React from 'react';
import { Room } from '../pages/Room';
import { MainPage } from '../pages/Main';
import { ResultPage } from '../pages/Result';
import '../stylesheets/reset.css';
import styles from '../stylesheets/style.module.scss';
import HeaderComponent from './Header/Header';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Route exact component={HeaderComponent} />
        <Route path="/room" component={Room} />
        <Route path="/main" component={MainPage} />
        <Route path="/result" component={ResultPage} />
      </Router>
    </>
  );
}

export default App;
