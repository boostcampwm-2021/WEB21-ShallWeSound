import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../context/MyContext';
import '../../../stylesheets/MusicPlayer.scss';
import Title from './Title';
import ThumbnailPlayer from './ThumbnailPlayer';

interface music {
  MID: number;
  name: string;
  singer: string;
  description: string;
  thumbnail: string;
  path: string;
  isPlayed: boolean;
}

function MusicPlayer() {
  const musicControl = useRef<HTMLVideoElement | null>(null);
  // const [musicList, setMusicList] = useState<music[] | any>(null);
  // const [musicIndex, setmusicIndex] = useState(0);
  const [musicInfo, setMusicInfo] = useState<music>();
  const [progressWidth, setProgressWidth] = useState(0);
  const [backupMusicVolume, setBackupMusicVolume] = useState(0);
  const [progressVolumeWidth, setProgressVolumeWidth] = useState(100);
  const socket: any = useSocket();

  useEffect(() => {
    socket.on('requestTime', () => {
      console.log('방장이다.');
      socket.emit('responseTime', musicControl.current?.currentTime);
    });

    socket.on('sync', (data: number) => {
      if (musicControl.current) {
        musicControl.current.currentTime = data;
      }
    });

    socket.on('changeMusicInfo', (data: music) => {
      console.log("music Info changing");
      console.log(data);
      setMusicInfo({
        ...musicInfo,
        ...data
      })
    });

    socket.on('clientPause', (data: string) => {
      musicControl.current?.pause();
    });

    socket.on('clientPlay', (data: string) => {
      musicControl.current?.play();
    });

    socket.on('clientMoving', (data: number) => {
      if (musicControl.current) {
        musicControl.current.currentTime = data;
      }
    });

    setTimeout(() => {
      if (musicControl.current) {
        musicControl.current.muted = false;
      }
    }, 200);
  }, []);

  function goPrevMusic() {
    // setmusicIndex((musicIndex - 1 + musicList.length) % musicList.length);
  }

  function goNextMusic() {
    console.log("music ended");
    socket.emit('nextMusicReq')
    // setmusicIndex((musicIndex + 1) % musicList.length);
  }

  // useEffect(() => {
  //   setMusicInfo({
  //     ...musicInfo,
  //     name: musicList[musicIndex].name,
  //     singer: musicList[musicIndex].singer,
  //     thumbnail: musicList[musicIndex].thumbnail,
  //     src: musicList[musicIndex].src,
  //   });
  //   socket.emit('nextMusicReq', { src: musicList[musicIndex].src });
  // }, []);

  // useEffect(() => {
  //   setMusicInfo({
  //     ...musicInfo,
  //     name: musicList[musicIndex].name,
  //     singer: musicList[musicIndex].singer,
  //     thumbnail: musicList[musicIndex].thumbnail,
  //     src: musicList[musicIndex].src,
  //   });
  //   socket.emit('nextMusicReq', { src: musicList[musicIndex].src });
  // }, [musicIndex]);

  // useEffect(() => {
  //   if (musicControl.current?.paused && musicInfo?.path && musicControl.current) {
  //     musicControl.current.play();
  //   }
  // }, [musicControl]);

  function changeFormatToTime(number: number) {
    const minute = Math.floor(number / 60);
    const second = Math.floor(number % 60);
    const formattedSecond = second >= 10 ? second : '0' + second.toString();

    return `${minute}:${formattedSecond}`;
  }

  function playOrPauseMusic() {
    const playingMusic = musicControl?.current;
    if (playingMusic?.paused) {
      playingMusic.play();
      playingMusic.onplay = () => {
        socket.emit('play');
      };
    } else if (playingMusic?.paused === false) {
      playingMusic.pause();
      playingMusic.onpause = () => {
        socket.emit('pause');
      };
    }
  }

  function updateMusic() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      playingMusic.play();
    }
  }

  function updateCurrentTime() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      setProgressWidth((playingMusic.currentTime / playingMusic.duration) * 100);
      playingMusic.onseeked = () => {
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
      playingMusic.currentTime = (playingMusic.duration * e.nativeEvent.offsetX) / 352; // 352: progressBar total width: ;
      playingMusic.onseeked = () => {
        socket.emit('moving', playingMusic.currentTime);
      };
    }
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
  }

  function toggleVolume() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      if (playingMusic.volume > 0) {
        setBackupMusicVolume(playingMusic.volume);
        playingMusic.volume = 0;
        setProgressVolumeWidth(0);
      } else {
        playingMusic.volume = backupMusicVolume;
        setProgressVolumeWidth(backupMusicVolume * 100);
      }
    }
  }

  return (
    <>
      <div className="musicplayer">
        <video
          id="video"
          src={musicInfo?.path}
          muted
          // autoPlay
          ref={musicControl}
          onTimeUpdate={updateCurrentTime}
          onLoadedMetadata={updateMusic}
          onEnded={goNextMusic}
        ></video>
        <Title name={musicInfo?.name} singer={musicInfo?.singer} />
        <div className="musicplayer-body">
          <img className="icon" src="/icons/chevron-left.svg" alt="chevron-left" onClick={goPrevMusic} />
          <ThumbnailPlayer
            name={musicInfo?.name}
            thumbnail={musicInfo?.thumbnail}
            musicControl={musicControl}
            onClick={playOrPauseMusic}
          />
          <img className="icon" src="/icons/chevron-right.svg" alt="chevron-right" onClick={goNextMusic} />
        </div>
        <div className="musicplayer-timer">
          <span className="current-time">{changeFormatToTime(musicControl.current?.currentTime || 0)}</span>
          <span className="max-duration">{changeFormatToTime(musicControl.current?.duration || 0)}</span>
        </div>
        <div className="progress" onClick={mousePositionRelativeToProgressBar}>
          <div className="progress-bar" style={progressStyle}></div>
        </div>
        <div className="serveral-icons">
          <div className="volume-wrap width-half">
            {musicControl.current?.volume === 0 ? (
              <img className="icon" src="/icons/volume-off.svg" alt="volume-off" onClick={toggleVolume} />
            ) : (
              <img className="icon" src="/icons/volume-up.svg" alt="volume-up" onClick={toggleVolume} />
            )}
            <div className="progress-wrap width-half">
              <div className="progress" onClick={mousePositionRelativeToVolumeProgressBar}>
                <div className="progress-bar" style={progressVolumeStyle}></div>
              </div>
            </div>
          </div>
          <input type="range" min="0" />
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
