import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/global.scss';
import App from './components/App';
import { MainPage } from './pages/Main';
import { ResultPage } from './pages/Result';
import { ContextProvider } from './context/MyContext';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <ContextProvider>
        <>
          <Route path="/room" component={App} />
          <Route exact path="/" component={MainPage} />
          <Route path="/result" component={ResultPage} />
        </>
      </ContextProvider>
    </React.StrictMode>
  </Router>,
  document.getElementById('root'),
);
