import React, { useState } from 'react';
import { Room } from '../pages/Room';
import { MainPage } from '../pages/Main';
import { ResultPage } from '../pages/Result';
import '../stylesheets/reset.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Route path="/room" component={Room} />
        <Route path="/main" component={MainPage} />
        <Route path="/result" component={ResultPage} />
      </Router>
    </>
  );
}

export default App;
