import React, { useState, useEffect } from "react";
import { nodeModuleNameResolver } from "typescript";
import './MusicPlayer.scss'

function Title({ name="Test", singer="Singer" }) {
  return (
    <div className="musicplayer-title-area">
      {/* <span>Daft Punk - Harder, Better, Faster, Stronger</span> */}
      <span className="musicplayer-title">{name}</span>
      <span className="musicplayer-subtitle">{singer}</span>
    </div>
  )
}

function PrevMusic ({ onClick } : { onClick: any }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <path d="M9 17L1 9L9 1" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function NextMusic ({ onClick } : { onClick: any }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <path d="M8 20L16 12L8 4" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MusicPlayer({ musicList } : { musicList: any }) {
  const [musicIndex, setmusicIndex] = useState(0);
  const [musicInfo, setMusicInfo] = useState({
    'name': 'noname',
    'singer': 'noname'
  });

  function goPrevMusic() {
    setmusicIndex((musicIndex - 1 + musicList.length) % musicList.length)
  }
  
  function goNextMusic() {
    setmusicIndex((musicIndex + 1) % musicList.length)
  }

  useEffect(() => {
    setMusicInfo({
      ...musicInfo,
      'name': musicList[musicIndex]['name'],
      'singer': musicList[musicIndex]['singer'],
    })
  }, [musicIndex])

  return (
    <>
      <div className="musicplayer">
        <Title name={musicInfo['name']} singer={musicInfo['singer']} />
        <div className="musicplayer-body">
          <PrevMusic onClick={goPrevMusic} />
          <div className="musicplayer-cover">
            <div className="cover-hover">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </div>
          </div>
          <NextMusic onClick={goNextMusic} />
        </div>
        <div className="musicplayer-timer">
          <span className="current-time">00:00</span>
          <span className="max-duration">04:22</span>
        </div>
        <div className="progress">
          <div className="progress-bar">
            <audio src=""></audio>
          </div>
        </div>
      </div>
    </>
  );
}

export default MusicPlayer;