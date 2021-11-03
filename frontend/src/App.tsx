import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [musicList, setMusicList] = useState([
    {
      name: "Harley Bird - Home",
      singer: "Jordan Schor",
      img: "music-1",
      src: "music-1"
    },
    {
      name: "Ikson Anywhere – Ikson",
      singer: "Audio Library",
      img: "music-2",
      src: "music-2"
    },
    {
      name: "Beauz & Jvna - Crazy",
      singer: "Beauz & Jvna",
      img: "music-3",
      src: "music-3"
    },
    {
      name: "Hardwind - Want Me",
      singer: "Mike Archangelo",
      img: "music-4",
      src: "music-4"
    },
    {
      name: "Jim - Sun Goes Down",
      singer: "Jim Yosef x Roy",
      img: "music-5",
      src: "music-5"
    },
    {
      name: "Lost Sky - Vision NCS",
      singer: "NCS Release",
      img: "music-6",
      src: "music-6"
    },
  ])

  return (
    <>
      <MusicPlayer musicList={musicList}></MusicPlayer>
    </>
  );
}

export default App;
