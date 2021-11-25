import React, { useEffect, useState, useRef, forwardRef } from 'react';
import config from '../config.host.json';
import { useInfiniteScroll } from '../hooks/useinfiniteScroll';
import { musicResultItem } from '../types';

interface ResultState {
  musicList: musicResultItem[];
  hasMore: boolean;
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

  function togglePlayMusic() {
    console.log('click');
    setPlayMusic(!playMusic);
  }

  return (
    <div className="search-result-item" onClick={togglePlayMusic}>
      <img className="search-result-thumbnail" src={thumbnail} alt={name} />
      <div className="search-result-words">
        <p className="search-result-name">{name}</p>
        <p className="search-result-singer">{singer}</p>
        <p className="search-result-description">{description}</p>
      </div>
      {playMusic && <video src={path} autoPlay controls />}
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

export { ResultPage };
