import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import config from '../config.host.json';
import SearchBar from './SearchBar';
import MusicSearchItem from './MusicSearchItem';
import CircleButton from './CircleButton';

interface Music {
  MID: number;
  name: string;
  thumnail: string;
  singer: string;
  description: string;
  path: string;
}

const color: string = 'linear-gradient(94.75deg,#918fe7 6.7%,#699eef 85.54%)';

const MusicSearch = () => {
  const [result, setResult] = useState<Music[]>([]);
  const [seletedMusics, setSeletedMusics] = useState<number[]>([]);

  const fetchMusic = useCallback(async (keyword: string) => {
    setSeletedMusics([]);

    const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}`);
    setResult(await res.json());
  }, []);

  const isSelected = (mid: number): boolean => (seletedMusics.indexOf(mid) >= 0 ? true : false);

  const selectMusic = (mid: number) => {
    const index = seletedMusics.indexOf(mid);

    index >= 0
      ? setSeletedMusics(seletedMusics.filter(id => id !== mid))
      : setSeletedMusics([...seletedMusics, mid]);
  };

  return (
    <Layout>
      <SearchBarWrapper>
        <SearchBar doFetch={fetchMusic} />
      </SearchBarWrapper>
      <ResultWrapper>
        {result.length ? (
          result.map((k: Music) => (
            <div key={k.MID} onClick={() => selectMusic(+k.MID)}>
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
      </ResultWrapper>
      <ButtonWrapper>
        <CircleButton size="45px" colorP={color} onClick={() => {}}>
          +
        </CircleButton>
      </ButtonWrapper>
    </Layout>
  );
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  /* margin: 1rem 0; */
`;

const SearchBarWrapper = styled.div`
  margin: 1rem 0;
  /* height: calc(100% * 0.1); */
`;

const ResultWrapper = styled(Layout)`
  height: calc(100% * 0.7);
  overflow-y: auto;
  overflow-x: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    /* Chrome, Safari, Opera*/
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    height: 17%;
    background: #e5e7e9;
    border-radius: 10px;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
`;

export default MusicSearch;
