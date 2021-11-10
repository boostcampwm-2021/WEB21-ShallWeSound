import React from 'react';
import { Room } from '../pages/Room';
import '../stylesheet/reset.css';
import { ContextProvider } from '../context/MyContext';
import styles from './style.module.scss';

function App() {
  return (
    <ContextProvider>
      <div className={styles.App}>
        <Room></Room>
      </div>
    </ContextProvider>
  );
}

export default App;
