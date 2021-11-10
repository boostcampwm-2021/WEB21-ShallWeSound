import React, { useState, useEffect, useRef, MouseEventHandler } from 'react';
import { useSocket } from '../context/MyContext';
import '../stylesheets/MusicPlayer.scss';

function Title({ name, singer }: { name: string; singer: string }) {
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
  const [musicVolume, setMusicVolume] = useState(1);
  const [backupMusicVolume, setBackupMusicVolume] = useState(0);
  const [progressVolumeWidth, setProgressVolumeWidth] = useState(100);
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

  const progressVolumeStyle = {
    height: 'inherit',
    width: progressVolumeWidth + '%',
    borderRadius: 'inherit',
  };

  function mousePositionRelativeToVolumeProgressBar(e: React.MouseEvent) {
    const playingMusic = musicControl.current;
    const offsetX = Math.max(0, Math.min(e.nativeEvent.offsetX / 88, 1));
    if (playingMusic) {
      playingMusic.volume = offsetX; // 88: progressBar total width
    }
    setProgressVolumeWidth(offsetX * 100);
    setMusicVolume(offsetX);
  }

  function toggleVolume() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      if (playingMusic.volume > 0) {
        setBackupMusicVolume(playingMusic.volume);
        playingMusic.volume = 0;
        setMusicVolume(0);
        setProgressVolumeWidth(0);
      } else {
        playingMusic.volume = backupMusicVolume;
        setMusicVolume(backupMusicVolume);
        setProgressVolumeWidth(backupMusicVolume * 100);
      }
    }
  }

  return (
    <>
      <div className="musicplayer">
        <video
          id="video"
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
        <div className="serveral-icons">
          <div className="volume-wrap width-half">
            {musicVolume === 0 ? (
              <img
                className="icon"
                src="/icons/volume-off.svg"
                alt="volume-off"
                onClick={toggleVolume}
              />
            ) : (
              <img
                className="icon"
                src="/icons/volume-up.svg"
                alt="volume-up"
                onClick={toggleVolume}
              />
            )}
            <div className="progress-wrap width-half">
              <div className="progress" onClick={mousePositionRelativeToVolumeProgressBar}>
                <div className="progress-bar" style={progressVolumeStyle}></div>
              </div>
            </div>
          </div>
          <div className="icons-wrap">
            <img className="icon" src="/icons/thumbs-up.svg" alt="thumbs-up" />
            <img className="icon" src="/icons/playlist-add.svg" alt="playlist-add" />
          </div>
        </div>
      </div>
    </>
  );
}

export default MusicPlayer;
