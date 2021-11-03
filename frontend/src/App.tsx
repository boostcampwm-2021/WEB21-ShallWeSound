import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [musicList, setMusicList] = useState([
    {
      name: "Harley Bird - Home",
      singer: "Jordan Schor",
      thumbnail: "/images/music-1.jpg",
      src: "music-1"
    },
    {
      name: "Ikson Anywhere – Ikson",
      singer: "Audio Library",
      thumbnail: "/images/music-2.jpg",
      src: "music-2"
    },
    {
      name: "Beauz & Jvna - Crazy",
      singer: "Beauz & Jvna",
      thumbnail: "/images/music-3.jpg",
      src: "music-3"
    },
    {
      name: "Hardwind - Want Me",
      singer: "Mike Archangelo",
      thumbnail: "/images/music-4.jpg",
      src: "music-4"
    },
    {
      name: "Jim - Sun Goes Down",
      singer: "Jim Yosef x Roy",
      thumbnail: "/images/music-5.jpg",
      src: "music-5"
    },
    {
      name: "Lost Sky - Vision NCS",
      singer: "NCS Release",
      thumbnail: "/images/music-6.jpg",
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
