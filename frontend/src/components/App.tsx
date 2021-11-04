import React, { useState } from 'react';
import MusicPlayer from './MusicPlayer';
import ChatComponent from './chat';
import { Room } from '../pages/Room';
import '../stylesheet/reset.css';
import styles from './style.module.scss';

function App() {
  interface musicInfo {
    name: string;
    singer: string;
    thumbnail: string;
    src: string;
  }

  const [musicList, setMusicList] = useState<musicInfo[]>([
    {
      name: 'Harley Bird - Home',
      singer: 'Jordan Schor',
      thumbnail: '/images/music-1.jpg',
      src: '/songs/music-1.mp3',
    },
    {
      name: 'Ikson Anywhere – Ikson',
      singer: 'Audio Library',
      thumbnail: '/images/music-2.jpg',
      src: '/songs/music-2.mp3',
    },
    {
      name: 'Beauz & Jvna - Crazy',
      singer: 'Beauz & Jvna',
      thumbnail: '/images/music-3.jpg',
      src: '/songs/music-3.mp3',
    },
    {
      name: 'Hardwind - Want Me',
      singer: 'Mike Archangelo',
      thumbnail: '/images/music-4.jpg',
      src: '/songs/music-4.mp3',
    },
    {
      name: 'Jim - Sun Goes Down',
      singer: 'Jim Yosef x Roy',
      thumbnail: '/images/music-5.jpg',
      src: '/songs/music-5.mp3',
    },
    {
      name: 'Lost Sky - Vision NCS',
      singer: 'NCS Release',
      thumbnail: '/images/music-6.jpg',
      src: '/songs/music-6.mp3',
    },
  ]);

  return (
    <div className={styles.App}>
      <div>
        <MusicPlayer musicList={musicList}></MusicPlayer>
        <ChatComponent />
      </div>
      <Room></Room>
    </div>
  );
}

export default App;
