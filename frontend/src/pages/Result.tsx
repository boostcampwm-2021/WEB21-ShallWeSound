import React, { useEffect, useState } from 'react';
import config from '../config.host.json';
import { RouteComponentProps } from 'react-router';
import { musicResultItem } from '../types';

function SearchResultItem ({ name, singer, thumbnail, description, path } : { name: string, singer: string, thumbnail: string, description: string, path: string }) {
  const [playMusic, setPlayMusic] = useState(false);

  function togglePlayMusic () {
    console.log("click")
    setPlayMusic(!playMusic);
  }

  return (
    <div className="search-result-item" onClick={togglePlayMusic}>
      <img className="search-result-thumbnail" src={thumbnail} alt={name} />
      <div className="search-result-words">
        <p className="search-result-name">{name.slice(0, name.lastIndexOf('.'))}</p>
        <p className="search-result-singer">{singer}</p>
        <p className="search-result-description">{description}</p>
      </div>
      {playMusic && <video src={path} autoPlay controls/> }
    </div>
  )
}

const ResultPage = ({ history }: { history: RouteComponentProps['history'] }) => {
  const [resultList, setResultList] = useState<musicResultItem[]>([]);

  useEffect(() => {
    const keyword = window.location.pathname.match(/[^/]+/gm)![1];
    fetch(`${config.localhost}/api/result?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => setResultList(data.list));
  }, []);

  return (
    <div className="body">
      <div className="main-wrap">
        <div className="search-result-wrap">
          <p className="search-result-cnt">총 {resultList.length} 개의 검색 결과가 있습니다.</p>
          {resultList.map(val => {
            return <SearchResultItem name={val.name} singer={val.singer} thumbnail={val.thumbnail} description={val.description} path={val.path} />;
          })}
          <div className="search-result-end">end</div>
        </div>
      </div>
    </div>
  );
};

export { ResultPage };
