import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/global.scss';
import App from './components/App';
import { MainPage } from './pages/Main';
import { ResultPage } from './pages/Result';
import { ContextProvider } from './context/MyContext';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <>
        <App></App>
      </>
    </ContextProvider>
  </React.StrictMode>,

  document.getElementById('root'),
);
