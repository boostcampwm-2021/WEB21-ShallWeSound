import React from 'react';
import { Room } from '../pages/Room';
import '../stylesheets/reset.css';
import styles from './style.module.scss';

function App() {
  return (
    <div className={styles.App}>
      <Room></Room>
    </div>
  );
}

export default App;
