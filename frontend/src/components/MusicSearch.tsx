import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import config from '../config.host.json';
import SearchBar from './SearchBar';

interface Music {
  MID: number;
  name: string;
  thumnail: string;
  singer: string;
  description: string;
  path: string;
}

const MusicSearch = () => {
  const [result, setResult] = useState<Music[]>([]);

  const fetchMusic = useCallback(async (keyword: string) => {
    const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}`);
    setResult(await res.json());
  }, []);

  return (
    <>
      <div>
        <SearchBar doFetch={fetchMusic} />
      </div>
      <div>
        {result.length ? (
          result.map((k: Music, i: number) => (
            <div key={i}>
              {k.name}
              {k.singer}
              {k.description}
            </div>
          ))
        ) : (
          <div>검색 결과 없음</div>
        )}
      </div>
    </>
  );
};

const SearchResult = styled.div``;

export default MusicSearch;
