import React, { useEffect, useState, useRef, forwardRef, MutableRefObject } from 'react';
import config from '../config.host.json';
import { useInfiniteScroll } from '../hooks/useinfiniteScroll';
import { musicResultItem } from '../types';

interface ResultState {
  musicList: musicResultItem[];
  hasMore: boolean;
}

function SearchedMusicPlayer ({ path, isPlay } : { path: string, isPlay: boolean }) {
  const musicControl = useRef<HTMLVideoElement | null>(null);
  const musicProgress = useRef<HTMLInputElement>(null);
  const volumeProgress = useRef<HTMLInputElement>(null);
  const [musicPlayerState, setMusicPlayerState] = useState({
    currentTime: 0,
    volume: 0.5,
    backupVolume: 0.5
  });

  function updateCurrentTime() {
    const playingMusic = musicControl.current;
    const playingMusicProgress = musicProgress.current;
    if (playingMusic && playingMusicProgress) {
      playingMusicProgress.value = playingMusic.currentTime.toString();
      setMusicPlayerState({
        ...musicPlayerState,
        currentTime: playingMusic.currentTime
      });
      playingMusicProgress.style.backgroundSize = (playingMusic.currentTime * 100) / playingMusic.duration + '% 100%';
    }
  }

  function changeInputRange(e: any) {
    const playingMusic = musicControl.current;
    const playingMusicProgress = musicProgress.current;
    if (playingMusic && playingMusicProgress) {
      playingMusic.currentTime = parseFloat(playingMusicProgress.value);
      playingMusicProgress.style.backgroundSize = (e.target.value * 100) / e.target.max + '% 100%';
    }
  }

  function changeFormatToTime(number: number) {
    const minute = Math.floor(number / 60);
    const second = Math.floor(number % 60);
    const formattedSecond = second >= 10 ? second : '0' + second.toString();

    return `${minute}:${formattedSecond}`;
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
        setMusicPlayerState({
          ...musicPlayerState,
          backupVolume: playingMusic.volume
        });
        musicVolume.value = '0';
        playingMusic.volume = 0;
        musicVolume.style.backgroundSize = playingMusic.volume * 100 + '% 100%';
      } else {
        musicVolume.value = (musicPlayerState.backupVolume * 100).toString();
        playingMusic.volume = musicPlayerState.backupVolume;
        musicVolume.style.backgroundSize = playingMusic.volume * 100 + '% 100%';
      }
    }
  }

  useEffect (() => {
    setMusicPlayerState({
      ...musicPlayerState,
      currentTime: 0,
      volume: 0.5,
    })
    toggleVolume();
    toggleVolume();
  }, []);

  return (
    <>
    <video src={path} ref={musicControl} autoPlay onTimeUpdate={updateCurrentTime}/> 
    {musicControl &&
      <div className="searched-musicplayer">
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
          max={musicControl.current?.duration}
          onInput={changeInputRange}
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
    }
    </>
  )
}

function SearchResultItem ({ name, singer, thumbnail, description, path } : { name: string, singer: string, thumbnail: string, description: string, path: string }) {
  const [playMusic, setPlayMusic] = useState(false);

  function togglePlayMusic () {
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
        <div className="search-result-play" onClick={togglePlayMusic}>
          {playMusic ?
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M8 5v14l11-7z"/>
          </svg>
          }
        </div>
      </div>
      {playMusic && <SearchedMusicPlayer path={path} isPlay={playMusic} />}
    </div>
  );
}

const ResultPages = (prop: any, ref: any) => {
  const [resultList, setResultList] = useState<ResultState>({
    musicList: [],
    hasMore: false,
  });
  const keyword = useRef('');
  const page = useRef(0);

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

  const setObserveTarget = useInfiniteScroll(fetchMusics);

  return (
    <div className="body">
      <div className="main-wrap">
        <div className="search-result-wrap">
          <p className="search-result-cnt">총 {musicList.length} 개의 검색 결과가 있습니다.</p>
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

export { ResultPage }