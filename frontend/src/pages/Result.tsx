import React, { useEffect, useState } from 'react';
import config from '../config.host.json';
import { RouteComponentProps } from 'react-router';
import HeaderComponent from '../components/Header/Header';

interface musicResultItem {
  name: string;
  singer: string;
  thumbnail: string;
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
    <>
      <HeaderComponent history={history} />
      <div>여긴 결과페이지다.</div>
      {resultList.map(val => {
        return (
          <div>
            {val.name}
            {val.singer}
            <img src={val.thumbnail}></img>
          </div>
        );
      })}
    </>
  );
};

export { ResultPage };
