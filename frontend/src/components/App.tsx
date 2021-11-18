import React from 'react';
import { Room } from '../pages/Room';
import '../stylesheets/reset.css';
import styles from '../stylesheets/style.module.scss';
import UploadModal from './Header/UploadModal';

function App() {
  return (
    <div className={styles.root}>
      <UploadModal />
      <div className={styles.App}>
        <Room></Room>
      </div>
    </div>
  );
}

export default App;
