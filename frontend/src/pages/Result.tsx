import React, { useEffect, useState } from 'react';
import config from '../config.host.json';
import { RouteComponentProps } from 'react-router';
import { musicResultItem } from '../types';

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
            return (
              <div className="search-result-item">
                <img className="search-result-thumbnail" src={val.thumbnail} alt={val.name} />
                <div className="search-result-words">
                  <p className="search-result-name">{val.name.slice(0, val.name.lastIndexOf('.'))}</p>
                  <p className="search-result-singer">{val.singer}</p>
                  <p className="search-result-description">{val.description}</p>
                </div>
              </div>
            );
          })}
          <div className="search-result-end">end</div>
        </div>
      </div>
    </div>
  );
};

export { ResultPage };
