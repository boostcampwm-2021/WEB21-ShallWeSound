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
  const [seletedMusics, setSeletedMusics] = useState<number[]>([]);

  const fetchMusic = useCallback(async (keyword: string) => {
    setSeletedMusics([]);

    const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}`);
    setResult(await res.json());
  }, []);

  const isSelected = (mid: number): boolean => (seletedMusics.indexOf(mid) >= 0 ? true : false);

  const selectMusic = (e: React.MouseEvent<HTMLDivElement>) => {
    const mid = +e.currentTarget.dataset.id!;
    const index = seletedMusics.indexOf(mid);

    index >= 0
      ? setSeletedMusics(seletedMusics.filter(id => id !== mid))
      : setSeletedMusics([...seletedMusics, mid]);
  };

  return (
    <>
      <Layout>
        <SearchBar doFetch={fetchMusic} />
      </Layout>
      <Layout>
        {result.length ? (
          result.map((k: Music) => (
            <div key={k.MID} data-id={k.MID} onClick={selectMusic}>
              <MusicSearchItem
                name={k.name}
                singer={k.singer}
                thumnail={k.thumnail}
                description={k.description}
                selected={isSelected(+k.MID)}
              />
            </div>
          ))
        ) : (
          <div>검색 결과 없음</div>
        )}
      </Layout>
    </>
  );
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 1rem 0;
`;

export default MusicSearch;
