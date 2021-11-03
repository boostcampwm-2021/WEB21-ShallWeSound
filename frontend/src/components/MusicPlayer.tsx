import React, { useState, useEffect } from "react";
import { nodeModuleNameResolver } from "typescript";
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

function MusicThumbnail ({ name, thumbnail } : { name: string, thumbnail: string }) {
  const [isHover, setIsHover] = useState(false);

  function onMouseEnter () {
    setIsHover(true);
  }
  
  function onMouseLeave () {
    setIsHover(false);
  }

  console.log("ghi")

  return (
    <div className="musicplayer-cover">
      <div className="cover-hover" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {thumbnail &&
        <img src={thumbnail} alt={name} />
        }
        {isHover && 
        <>
          <div className="only-hover"></div>
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
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
  });

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
      name: musicList[musicIndex]['name'],
      singer: musicList[musicIndex]['singer'],
      thumbnail: musicList[musicIndex]['thumbnail'],
    })
  }, [musicIndex])

  console.log("def")

  return (
    <>
      <div className="musicplayer">
        <Title name={musicInfo['name']} singer={musicInfo['singer']} />
        <div className="musicplayer-body">
          <img src="/icons/chevron-left.svg" alt="chevron-left" onClick={goPrevMusic} />
          <MusicThumbnail name={musicInfo['name']} thumbnail={musicInfo['thumbnail']} />
          <img src="/icons/chevron-right.svg" alt="chevron-right" onClick={goNextMusic} />
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