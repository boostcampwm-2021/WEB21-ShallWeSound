import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../context/MyContext';
import '../../../stylesheets/MusicPlayer.scss';
import Title from './Title';
import ThumbnailPlayer from './ThumbnailPlayer';
import { Socket } from 'socket.io-client';
import { music } from '../../../types';
import Progress from '../../Util/Progress';

function MusicPlayer({ isHost }: { isHost: boolean }) {
  const socket: Socket = useSocket()!;
  const musicControl = useRef<HTMLVideoElement | null>(null);
  const [musicInfo, setMusicInfo] = useState<music>();
  const [musicPlayerState, setMusicPlayerState] = useState({
    currentTime: "0:00",
    duration: "0:00",
    progressDegree: 0,
  });
  const [musicVolumeState, setMusicVolumeState] = useState({
    volume: 50,
    backupVolume: 50,
    progressDegree: 50,
  })

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
    if (playingMusic) {
      setMusicPlayerState({
        ...musicPlayerState,
        currentTime: changeFormatToTime(playingMusic.currentTime),
        duration: changeFormatToTime(playingMusic.duration),
        progressDegree: playingMusic.currentTime * 100 / playingMusic.duration,
      });
      playingMusic.onseeked = () => {
        socket.emit('playControl', playingMusic.currentTime);
      };
    }
  }

  function onChangeMusicProgress(val: number) {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      playingMusic.currentTime = val;
      updateCurrentTime();
    }
  }

  function onChangeVolume(e: number) {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      playingMusic.volume = e / 100;
      setMusicVolumeState({
        ...musicVolumeState,
        volume: e,
        progressDegree: e,
      });
    }
  }

  function toggleVolume() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      if (playingMusic.volume > 0) {
        setMusicVolumeState({
          ...musicVolumeState,
          volume: 0,
          backupVolume: playingMusic.volume * 100,
          progressDegree: 0,
        });
        playingMusic.volume = 0;
      } else {
        setMusicVolumeState({
          ...musicVolumeState,
          volume: musicVolumeState.backupVolume,
          progressDegree: musicVolumeState.backupVolume,
        })
        playingMusic.volume = musicVolumeState.backupVolume / 100;
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

  let musicProgressProps = {
    tops: [musicPlayerState.currentTime, musicPlayerState.duration],
    min: 0,
    max: musicControl.current && musicControl.current.duration,
    progressDegree: musicPlayerState.progressDegree,
    disabled: !isHost,
    onChange: onChangeMusicProgress,
  }

  let musicVolumeProps = {
    lefts: [musicControl.current?.volume === 0 ? (
      <img className="icon" src="/icons/volume-off.svg" alt="volume-off" onClick={toggleVolume} />
    ) : (
      <img className="icon" src="/icons/volume-up.svg" alt="volume-up" onClick={toggleVolume} />
    )],
    min: 0,
    max: 100,
    progressDegree: musicVolumeState.progressDegree,
    onChange: onChangeVolume,
  }

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
        <Progress prop={musicProgressProps} />
        <div className="volume-wrap width-half">
          <Progress prop={musicVolumeProps} />
        </div>
      </div>
    </>
  );
}

export default MusicPlayer;
