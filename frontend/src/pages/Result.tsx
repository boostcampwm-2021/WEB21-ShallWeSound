import React, { useEffect, useState } from 'react';
import config from '../config.host.json';

interface musicResultItem {
  name: string;
  singer: string;
  thumbnail: string;
}

const ResultPage = () => {
  const [resultList, setResultList] = useState<musicResultItem[]>([]);

  useEffect(() => {
    const keyword = window.location.pathname.match(/[^/]+/gm)![1];
    fetch(`${config.localhost}/api/result?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => console.log(data.test[0].name));
  });

  return (
    <>
      <div>여긴 결과페이지다.</div>
    </>
  );
};

export { ResultPage };
