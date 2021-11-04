import React, { useState, useEffect, useRef } from "react";
import './MusicPlayer.scss'

function Title({ name="Test", singer="Singer" }) {
  return (
    <div className="musicplayer-title-area">
      <span className="musicplayer-title">{name}</span>
      <span className="musicplayer-subtitle">{singer}</span>
    </div>
  )
}

function PrevMusic ({ onClick } : { onClick: any }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFF" onClick={onClick} >
      <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/>
      <path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z" />
    </svg>
  )
}

function NextMusic ({ onClick } : { onClick: any }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFF" onClick={onClick} >
      <g><path d="M0,0h24v24H0V0z" fill="none"/></g>
      <g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" /></g>
    </svg>
  )
}

function MusicThumbnail ({ name, thumbnail, nowPlaying, onClick } : { name: string, thumbnail: string, nowPlaying: boolean, onClick: any }) {
  const [isHover, setIsHover] = useState(false);
  function onMouseEnter () { setIsHover(true) }
  function onMouseLeave () { setIsHover(false) }

  // console.log("ghi")

  return (
    <div className="musicplayer-cover" onClick={onClick} >
      <div className="cover-hover" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {thumbnail &&
        <img src={thumbnail} alt={name} />
        }
        {isHover && 
        <>
          <div className="only-hover"></div>
          {nowPlaying ?
          <img className="icon" src="/icons/pause.svg" alt="pause" /> :
          <img className="icon" src="/icons/play.svg" alt="play" />
          }
        </>
        }
      </div>
    </div>
  )
}


function MusicPlayer({ musicList } : { musicList: any }) {
  const [musicIndex, setmusicIndex] = useState(0);
  const [musicInfo, setMusicInfo] = useState({
    name: 'noname',
    singer: 'noname',
    thumbnail: '',
    src: '',
  });
  const musicControl = useRef<HTMLVideoElement>(null);
  const [nowPlaying, setNowPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [playingMusic, setPlayingMusic] = useState(musicControl && musicControl.current);

  function goPrevMusic() {
    setmusicIndex((musicIndex - 1 + musicList.length) % musicList.length)
  }
  
  function goNextMusic() {
    setmusicIndex((musicIndex + 1) % musicList.length)
  }

  useEffect(() => {
    console.log("abc")
    setMusicInfo({
      ...musicInfo,
      name: musicList[musicIndex].name,
      singer: musicList[musicIndex].singer,
      thumbnail: musicList[musicIndex].thumbnail,
      src: musicList[musicIndex].src,
    })
  }, [musicIndex])

  // useEffect(() => {
  //   const playingMusic = musicControl && musicControl.current;
  //   if (playingMusic) {
  //     playingMusic.play();
  //   }
  // }, [musicInfo, controlInfo])

  function playOrPauseMusic() { 
    const playingMusic = musicControl && musicControl.current;
    if (playingMusic) {
      if (nowPlaying) {
        playingMusic.pause();
        setNowPlaying(false);
      } else {
        playingMusic.play();
        setNowPlaying(true);
      }
    }
  }

  console.log("def")

  return (
    <>
      <div className="musicplayer">
        <Title name={musicInfo.name} singer={musicInfo.singer} />
        <div className="musicplayer-body">
          <img src="/icons/chevron-left.svg" alt="chevron-left" onClick={goPrevMusic} />
          <MusicThumbnail name={musicInfo.name} thumbnail={musicInfo.thumbnail} nowPlaying={nowPlaying} onClick={playOrPauseMusic} />
          <img src="/icons/chevron-right.svg" alt="chevron-right" onClick={goNextMusic} />
        </div>
        <div className="musicplayer-timer">
          <span className="current-time">00:00</span>
          <span className="max-duration">04:22</span>
        </div>
        <div className="progress">
          <div className="progress-bar">
          </div>
        </div>
      </div>
          <video controls src={musicInfo.src} ref={musicControl}></video>
    </>
  );
}

export default MusicPlayer;