import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import config from '../config.host.json';
import SearchBar from './SearchBar';
import MusicSearchItem from './MusicSearchItem';

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
      <Wrapper>
        <SearchBar doFetch={fetchMusic} />
      </Wrapper>
      <Wrapper>
        {result.length ? (
          result.map((k: Music, i: number) => (
            <MusicSearchItem
              key={i}
              name={k.name}
              singer={k.singer}
              thumnail={k.thumnail}
              description={k.description}
            />
          ))
        ) : (
          <div>검색 결과 없음</div>
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 1rem 0;
`;

export default MusicSearch;
