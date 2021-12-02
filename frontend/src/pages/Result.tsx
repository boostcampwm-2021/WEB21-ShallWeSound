import React, { useEffect, useState, useRef, forwardRef } from 'react';
import config from '../config.host.json';
import { useInfiniteScroll } from '../hooks/useinfiniteScroll';
import { musicResultItem } from '../types';
import Progress from '../components/Util/Progress';
import { useSocket } from '../context/MyContext';
import { Socket } from 'socket.io-client';
import { RouteComponentProps } from 'react-router';

interface ResultState {
  musicList: musicResultItem[];
  hasMore: boolean;
}

function SearchedMusicPlayer({ path, isPlay }: { path: string; isPlay: boolean }) {
  const musicControl = useRef<HTMLVideoElement | null>(null);
  const [musicPlayerState, setMusicPlayerState] = useState({
    currentTime: '',
    duration: '',
    progressDegree: 0,
  });
  const [musicVolumeState, setMusicVolumeState] = useState({
    volume: 50,
    backupVolume: 50,
    progressDegree: 50,
  });

  useEffect(() => {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      isPlay ? playingMusic.play() : playingMusic.pause();
    }
  }, [isPlay]);

  function changeFormatToTime(number: number) {
    const minute = Math.floor(number / 60);
    const second = Math.floor(number % 60);
    const formattedSecond = second >= 10 ? second : '0' + second.toString();

    return `${minute}:${formattedSecond}`;
  }

  function updateCurrentTime() {
    const playingMusic = musicControl.current;
    if (playingMusic) {
      setMusicPlayerState({
        ...musicPlayerState,
        currentTime: changeFormatToTime(playingMusic.currentTime),
        duration: changeFormatToTime(playingMusic.duration),
        progressDegree: (playingMusic.currentTime * 100) / playingMusic.duration,
      });
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
        });
        playingMusic.volume = musicVolumeState.backupVolume / 100;
      }
    }
  }

  useEffect(() => {
    setMusicPlayerState({
      ...musicPlayerState,
      currentTime: changeFormatToTime(0),
      duration: musicControl.current ? changeFormatToTime(musicControl.current.duration) : '0',
    });
    toggleVolume();
    toggleVolume();
  }, []);

  let musicProgressProps = {
    tops: [musicPlayerState.currentTime, musicPlayerState.duration],
    min: 0,
    max: musicControl.current && musicControl.current.duration,
    progressDegree: musicPlayerState.progressDegree,
    onChange: onChangeMusicProgress,
  };

  let musicVolumeProps = {
    lefts: [
      musicControl.current?.volume === 0 ? (
        <img className="icon" src="/icons/volume-off.svg" alt="volume-off" onClick={toggleVolume} />
      ) : (
        <img className="icon" src="/icons/volume-up.svg" alt="volume-up" onClick={toggleVolume} />
      ),
    ],
    min: 0,
    max: 100,
    progressDegree: musicVolumeState.progressDegree,
    onChange: onChangeVolume,
  };

  return (
    <>
      <video src={path} ref={musicControl} autoPlay onTimeUpdate={updateCurrentTime} />
      {musicControl && (
        <div className="searched-musicplayer">
          <Progress prop={musicProgressProps} />
          <div className="volume-wrap width-quarter">
            <Progress prop={musicVolumeProps} />
          </div>
        </div>
      )}
    </>
  );
}

function SearchResultItem({
  name,
  singer,
  thumbnail,
  description,
  path,
}: {
  name: string;
  singer: string;
  thumbnail: string;
  description: string;
  path: string;
}) {
  const [playMusic, setPlayMusic] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function togglePlayMusic() {
    if (!isOpen) {
      setIsOpen(true);
    }
    setPlayMusic(!playMusic);
  }

  return (
    <div className="search-result">
      <div className="search-result-item">
        <img className="search-result-thumbnail" src={thumbnail} alt={name} />
        <div className="search-result-words">
          <p className="search-result-name">{name.slice(0, name.lastIndexOf('.'))}</p>
          <p className="search-result-singer">{singer}</p>
          <p className="search-result-description">{description}</p>
        </div>
        <div className="search-result-blank"></div>
        <div className="search-result-play" onClick={togglePlayMusic}>
          {playMusic ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFF">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </div>
      {isOpen && <SearchedMusicPlayer path={path} isPlay={playMusic} />}
    </div>
  );
}

const ResultPages = ({ history }: { history: RouteComponentProps['history'] }) => {
  const [resultList, setResultList] = useState<ResultState>({
    musicList: [],
    hasMore: false,
  });
  const scrollBar = useRef<HTMLDivElement | null>(null);
  const keyword = useRef('');
  const page = useRef(0);

  const socket: Socket = useSocket()!;

  const fetchMusics = async (more = true) => {
    fetch(`${config.localhost}/api/music?keyword=${keyword.current}&page=${page.current}`)
      .then(res => res.json())
      .then(data => {
        if (more) {
          setResultList({
            musicList: [...musicList, ...data.result],
            hasMore: data.hasMore,
          });
        } else {
          setResultList({
            musicList: data.result,
            hasMore: data.hasMore,
          });
          scrollBar.current?.scrollTo(0, 0);
        }
      });
  };

  const { musicList, hasMore } = resultList;

  useEffect(() => {
    page.current = 0;
    keyword.current = window.location.pathname.match(/[^/]+/gm)![1];
    fetchMusics(false);
  }, [window.location.pathname]);

  useEffect(() => {
    page.current = musicList.length;
  }, [musicList]);

  useEffect(() => {
    socket.on('routingAfterCreateRoom', (roomNumber: number) => {
      history.push(`/room/${roomNumber}`);
    });

    return () => {
      socket.off('routingAfterCreateRoom');
    };
  }, []);

  const setObserveTarget = useInfiniteScroll(fetchMusics);

  return (
    <div className="body">
      <div className="main-wrap">
        <div className="search-result-wrap" ref={scrollBar}>
          <p className="search-result-cnt">현재까지 '{musicList.length}'개의 결과가 검색 되었습니다.</p>
          {musicList.map(val => (
            <SearchResultItem
              name={val.name}
              singer={val.singer}
              thumbnail={val.thumbnail}
              description={val.description}
              path={val.path}
            />
          ))}
          <div ref={hasMore ? setObserveTarget : null}>&nbsp;</div>
        </div>
      </div>
    </div>
  );
};

const ResultPage = forwardRef(ResultPages);

export { ResultPage };
