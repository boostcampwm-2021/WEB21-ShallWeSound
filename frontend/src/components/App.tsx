import React from 'react';
import { Room } from '../pages/Room';
import '../stylesheets/reset.css';
import styles from '../stylesheets/style.module.scss';
import HeaderComponent from './Header/Header';

function App() {
  return (
    <div className={styles.root}>
      <HeaderComponent />
      <div className={styles.App}>
        <Room></Room>
      </div>
    </div>
  );
}

export default App;
