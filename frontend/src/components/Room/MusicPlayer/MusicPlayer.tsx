import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../context/MyContext';
import '../../../stylesheets/MusicPlayer.scss';
import Title from './Title';
import ThumbnailPlayer from './ThumbnailPlayer';
import { Socket } from 'socket.io-client';
import { music } from '../../../types';

function MusicPlayer({ isHost }: { isHost: boolean }) {
  const musicControl = useRef<HTMLVideoElement | null>(null);
  const musicProgress = useRef<HTMLInputElement>(null);
  const volumeProgress = useRef<HTMLInputElement>(null);
  const [musicCurrentTime, setMusicCurrentTime] = useState(0);
  const [musicInfo, setMusicInfo] = useState<music>();
  const [backupMusicVolume, setBackupMusicVolume] = useState(0);
  const socket: Socket = useSocket()!;

  const playController = (playType: string) => {
    switch (playType) {
      case 'play':
        musicControl.current?.play();
        break;
      case 'pause':
        musicControl.current?.pause();
        break;
      default:
        if (musicControl.current) {
          musicControl.current.currentTime = parseInt(playType);
        }
    }
  };

  const sync = (hostCurrentTime: number) => {
    if (musicControl.current) {
      musicControl.current.currentTime = hostCurrentTime;
    }
  };

  const emitHostCurrentTime = () => {
    socket.emit('responseTime', musicControl.current?.currentTime);
  };

  const setInfo = (musicData: music) => {
    setMusicInfo({
      ...musicInfo,
      ...musicData,
    });
  };

  const autoPlayFake = () => {
    setTimeout(() => {
      if (musicControl.current) {
        musicControl.current.muted = false;
      }
    }, 200);
  };

  function goPrevMusic() {
    socket.emit('prevMusicReq');
  }
  function goNextMusic() {
    socket.emit('nextMusicReq');
  }

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
        socket.emit('playControl', 'play');
      };
    } else if (playingMusic?.paused === false) {
      playingMusic.pause();
      playingMusic.onpause = () => {
        socket.emit('playControl', 'pause');
      };
    }
  }

  function updateMusic() {
    musicControl?.current?.play();
  }

  function updateCurrentTime() {
    const playingMusic = musicControl.current;
    const playingMusicProgress = musicProgress.current;
    if (playingMusic && playingMusicProgress) {
      setMusicCurrentTime(playingMusic.currentTime);
      playingMusicProgress.value = playingMusic.currentTime.toString();
      playingMusicProgress.style.backgroundSize = (playingMusic.currentTime * 100) / playingMusic.duration + '% 100%';
      playingMusic.onseeked = () => {
        socket.emit('playControl', playingMusic.currentTime);
      };
    }
  }

  function changeInputRange(e: any) {
    const playingMusic = musicControl?.current;
    const playingMusicProgress = musicProgress.current;
    if (playingMusic && playingMusicProgress) {
      playingMusic.currentTime = parseFloat(playingMusicProgress.value);
      playingMusicProgress.style.backgroundSize = (e.target.value * 100) / e.target.max + '% 100%';
    }
  }

  function changeVolume(e: any) {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      playingMusic.volume = e.target.value / 100;
      e.target.style.backgroundSize = e.target.value + '% 100%';
    }
  }

  function toggleVolume() {
    const playingMusic = musicControl.current;
    const musicVolume = volumeProgress.current;
    if (playingMusic && musicVolume) {
      if (playingMusic.volume > 0) {
        setBackupMusicVolume(playingMusic.volume);
        musicVolume.value = '0';
        playingMusic.volume = 0;
        musicVolume.style.backgroundSize = playingMusic.volume * 100 + '% 100%';
      } else {
        musicVolume.value = (backupMusicVolume * 100).toString();
        playingMusic.volume = backupMusicVolume;
        musicVolume.style.backgroundSize = playingMusic.volume * 100 + '% 100%';
      }
    }
  }

  useEffect(() => {
    socket.on('requestTime', emitHostCurrentTime);
    socket.on('sync', sync);
    socket.on('changeMusicInfo', setInfo);
    socket.on('playControl', playController);
    autoPlayFake();
  }, []);

  return (
    <>
      <div className="musicplayer">
        <video
          id="video"
          src={musicInfo?.path}
          muted
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
        <input
          className="input-range"
          name="musicplayer-progress"
          ref={musicProgress}
          type="range"
          min="0"
          max={musicControl.current?.duration || 0}
          onInput={changeInputRange}
          disabled={!isHost}
        />
        <div className="serveral-icons">
          <div className="volume-wrap width-half">
            {musicControl.current?.volume === 0 ? (
              <img className="icon" src="/icons/volume-off.svg" alt="volume-off" onClick={toggleVolume} />
            ) : (
              <img className="icon" src="/icons/volume-up.svg" alt="volume-up" onClick={toggleVolume} />
            )}
            <div className="progress-wrap width-half">
              <input
                className="input-range"
                name="volume-progress"
                ref={volumeProgress}
                type="range"
                min="0"
                max="100"
                onInput={changeVolume}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MusicPlayer;
