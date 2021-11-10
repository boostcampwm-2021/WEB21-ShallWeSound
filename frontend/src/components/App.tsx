import React from 'react';
import { Room } from '../pages/Room';
import UploadModal from './UploadModal'
import '../stylesheet/reset.css';
import styles from './style.module.scss';

function App() {
  return (
    <div className={styles.root}>
      <UploadModal/>
      <div className={styles.App}>
        <Room></Room>
      </div>
    </div>
  );
}

export default App;
