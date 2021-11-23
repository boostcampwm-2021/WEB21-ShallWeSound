import React, { useEffect, useState, useRef, forwardRef } from 'react';
import config from '../config.host.json';
import { musicResultItem } from '../types';
import PlayButton from '../components/Util/PlayButton';
const ResultPages = (prop: any, ref: any) => {
  const musicProgress = useRef<HTMLInputElement>(null);
  const musicControl = useRef<HTMLAudioElement>(null);
  const [srcState, setSrc] = useState<string>('');
  const [resultList, setResultList] = useState<musicResultItem[]>([]);

  useEffect(() => {
    const keyword = window.location.pathname.match(/[^/]+/gm)![1];
    fetch(`${config.localhost}/api/result?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => setResultList(data.list));
  }, [window.location.pathname]);

  const click = (src: string) => {
    setSrc(src);
  };

  return (
    <>
      <div className="body">
        {/* <input
          className="input-range"
          name="musicplayer-progress"
          onInput={changeInputRange}
          ref={musicProgress}
          type="range"
          min="0"
        /> */}
        {/* <audio src={srcState} ref={musicControl} className={'result-player'} loop controls></audio> */}
        <div className="search-main-wrap">
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
                  {/* <PlayButton audRef={musicControl} src={val.path} play={click}></PlayButton> */}
                </div>
              );
            })}
            <div className="search-result-end">end</div>
          </div>
        </div>
      </div>
    </>
  );
};

const ResultPage = forwardRef(ResultPages);

export { ResultPage };
