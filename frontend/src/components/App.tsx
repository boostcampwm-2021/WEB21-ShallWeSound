import React from 'react';
import { Room } from '../pages/Room';
import '../stylesheets/reset.css';
import styles from '../stylesheets/style.module.scss';
import HeaderComponent from './Header/Header';

function App() {
  return (
    <>
      <HeaderComponent />
      <div className="body">
        <Room></Room>
      </div>
    </>
  );
}

export default App;
