import React, { useState, useEffect, useRef, MouseEventHandler } from 'react';
import { useSocket } from '../context/MyContext';
import './MusicPlayer.scss';

function Title({ name = 'Test', singer = 'Singer' }) {
  return (
    <div className="musicplayer-title-area">
      <span className="musicplayer-title">{name}</span>
      <span className="musicplayer-subtitle">{singer}</span>
    </div>
  );
}

function MusicThumbnail({
  name,
  thumbnail,
  nowPlaying,
  onClick,
}: {
  name: string;
  thumbnail: string;
  nowPlaying: boolean;
  onClick: MouseEventHandler;
}) {
  const [isHover, setIsHover] = useState(false);
  function onMouseEnter() {
    setIsHover(true);
  }
  function onMouseLeave() {
    setIsHover(false);
  }

  return (
    <div className="musicplayer-cover" onClick={onClick}>
      <div className="cover-hover" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {thumbnail && <img src={thumbnail} alt={name} />}
        {isHover && (
          <>
            <div className="only-hover"></div>
            {nowPlaying ? (
              <img className="icon" src="/icons/pause.svg" alt="pause" />
            ) : (
              <img className="icon" src="/icons/play.svg" alt="play" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface musicInfo {
  name: string;
  singer: string;
  thumbnail: string;
  src: string;
}

function MusicPlayer({ musicList }: { musicList: musicInfo[] }) {
  const [musicIndex, setmusicIndex] = useState(0);
  const [musicInfo, setMusicInfo] = useState<musicInfo>({
    name: 'noname',
    singer: 'noname',
    thumbnail: '',
    src: '',
  });
  const musicControl = useRef<HTMLVideoElement>(null);
  const [nowPlaying, setNowPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const socket: any = useSocket();

  useEffect(() => {
    const aud: any = document.getElementById('video')!;

    socket.on('requestTime', (data: string) => {
      console.log('방장이다.');
      socket.emit('responseTime', aud.currentTime);
    });

    socket.on('sync', (data: string) => {
      console.log(data);
      aud.currentTime = data;
    });

    socket.on('clientPause', (data: string) => {
      aud.pause();
    });

    socket.on('clientPlay', (data: string) => {
      aud.play();
    });

    socket.on('clientMoving', (data: number) => {
      aud.currentTime = data;
    });

    setTimeout(() => {
      aud.muted = false;
    }, 200);
  }, []);

  function goPrevMusic() {
    setmusicIndex((musicIndex - 1 + musicList.length) % musicList.length);
  }

  function goNextMusic() {
    setmusicIndex((musicIndex + 1) % musicList.length);
  }

  useEffect(() => {
    setMusicInfo({
      ...musicInfo,
      name: musicList[musicIndex].name,
      singer: musicList[musicIndex].singer,
      thumbnail: musicList[musicIndex].thumbnail,
      src: musicList[musicIndex].src,
    });
    socket.emit('nextMusicReq', { src: musicList[musicIndex].src });
  }, []);

  useEffect(() => {
    setMusicInfo({
      ...musicInfo,
      name: musicList[musicIndex].name,
      singer: musicList[musicIndex].singer,
      thumbnail: musicList[musicIndex].thumbnail,
      src: musicList[musicIndex].src,
    });
    socket.emit('nextMusicReq', { src: musicList[musicIndex].src });
  }, [musicIndex]);

  useEffect(() => {
    console.log(musicInfo);
    console.log(musicControl.current);
    if (nowPlaying && musicInfo.src && musicControl.current) {
      musicControl.current.play();
      // socket.on('requestTime', (data: string) => {
      //   console.log('방장이다.');
      //   socket.emit('responseTime', currentTime);
      // });
    }
  }, [musicControl]);

  function changeFormatToTime(number: number) {
    const minute = Math.floor(number / 60);
    const second = Math.floor(number % 60);
    const formattedSecond = second >= 10 ? second : '0' + second.toString();

    return `${minute}:${formattedSecond}`;
  }

  function playOrPauseMusic() {
    const playingMusic = musicControl && musicControl.current;
    if (playingMusic) {
      if (nowPlaying) {
        playingMusic.pause();
        setNowPlaying(false);
        playingMusic.onpause = () => {
          socket.emit('pause', '멈추시오');
        };
      } else {
        playingMusic.play();
        setNowPlaying(true);
        playingMusic.onplay = () => {
          socket.emit('play', '사작하시오');
        };
      }
    }
  }

  function updateMusic() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      setCurrentTime(0);
      setTotalTime(playingMusic.duration);
      if (nowPlaying) playingMusic.play();
    }
  }

  function updateCurrentTime() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      setCurrentTime(playingMusic.currentTime);
      setProgressWidth((playingMusic.currentTime / playingMusic.duration) * 100);
      playingMusic.onseeked = () => {
        console.log(playingMusic.currentTime);
        socket.emit('moving', playingMusic.currentTime);
      };
    }
  }

  const progressStyle = {
    height: 'inherit',
    width: progressWidth + '%',
    borderRadius: 'inherit',
  };

  function mousePositionRelativeToProgressBar(e: React.MouseEvent) {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      playingMusic.currentTime = (totalTime * e.nativeEvent.offsetX) / 352; // 352: progressBar total width
      playingMusic.onseeked = () => {
        console.log(playingMusic.currentTime);
        socket.emit('moving', playingMusic.currentTime);
      };
    }
    setCurrentTime((totalTime * e.nativeEvent.offsetX) / 352);
  }

  return (
    <>
      <div className="musicplayer">
        {/* <div className="hover">
          <img className="icon" src="/icons/play-circle.svg" alt="play-circle" />
        </div> */}
        <video
          id="video"
          muted
          autoPlay
          src={musicInfo.src}
          ref={musicControl}
          onTimeUpdate={updateCurrentTime}
          onLoadedMetadata={updateMusic}
          onEnded={goNextMusic}
        ></video>
        <Title name={musicInfo.name} singer={musicInfo.singer} />
        <div className="musicplayer-body">
          <img
            className="icon"
            src="/icons/chevron-left.svg"
            alt="chevron-left"
            onClick={goPrevMusic}
          />
          <MusicThumbnail
            name={musicInfo.name}
            thumbnail={musicInfo.thumbnail}
            nowPlaying={nowPlaying}
            onClick={playOrPauseMusic}
          />
          <img
            className="icon"
            src="/icons/chevron-right.svg"
            alt="chevron-right"
            onClick={goNextMusic}
          />
        </div>
        <div className="musicplayer-timer">
          <span className="current-time">{changeFormatToTime(currentTime)}</span>
          <span className="max-duration">{changeFormatToTime(totalTime)}</span>
        </div>
        <div className="progress" onClick={mousePositionRelativeToProgressBar}>
          <div className="progress-bar" style={progressStyle}></div>
        </div>
      </div>
    </>
  );
}

export default MusicPlayer;
