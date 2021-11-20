import React from 'react';
import { Room } from '../pages/Room';
import '../stylesheets/reset.css';
import styles from '../stylesheets/style.module.scss';
import HeaderComponent from './Header/Header';
import { RouteComponentProps } from 'react-router';

function App({ history }: { history: RouteComponentProps['history'] }) {
  return (
    <div className={styles.root}>
      <HeaderComponent history={history} />
      <div className={styles.App}>
        <Room></Room>
      </div>
    </div>
  );
}

export default App;
