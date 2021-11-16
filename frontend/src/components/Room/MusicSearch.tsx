import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import config from '../../config.host.json';
import SearchBar from '../Util/SearchBar';
import MusicSearchItem from './MusicSearchItem';
import CircleButton from '../Util/CircleButton';
import { useSocket } from '../../context/MyContext';

interface Music {
  MID: number;
  name: string;
  singer: string;
  description: string;
  thumbnail: string;
  path: string;
  isPlayed: boolean;
}

interface SearchResult {
  result: Music[];
  selectedInResult: number[];
}

const MusicSearch = () => {
  const socket: any = useSocket();
  const page = useRef(0);
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult>({
    result: [],
    selectedInResult: [],
  });

  const { result, selectedInResult } = searchResult;

  const fetchMusic = async () => {
    const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}&page=${page.current}`);
    const musics = await res.json();

    setSearchResult({
      ...searchResult,
      result: [...result, ...musics],
    });
  };

  useEffect(() => {
    page.current = 0;
    fetchMusic();
  }, [keyword]);

  useEffect(() => {
    page.current = result.length;
  }, [result]);

  const addMusicInPlayList = () => {
    socket.emit('addMusicInPlayListReq', selectedInResult);

    setSearchResult({
      ...searchResult,
      selectedInResult: [],
    });
  };

  const onScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const isEndOfScroll = e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight;

    if (isEndOfScroll) {
      fetchMusic();
    }
  };

  const isSelected = (MID: number): boolean => (selectedInResult.indexOf(MID) >= 0 ? true : false);

  const selectMusic = (MID: number) => {
    if (selectedInResult.indexOf(MID) >= 0) {
      setSearchResult({
        ...searchResult,
        selectedInResult: selectedInResult.filter(id => id !== MID),
      });
    } else {
      setSearchResult({
        ...searchResult,
        selectedInResult: [...selectedInResult, MID],
      });
    }
  };

  const onKeywordChange = (value: string) => {
    setKeyword(value);
    setSearchResult({
      result: [],
      selectedInResult: [],
    });
  };

  console.log(keyword);
  return (
    <Layout>
      <SearchBar keyword={keyword} onKeywordChange={onKeywordChange} />
      <ResultWrapper onScroll={onScroll}>
        {result.length ? (
          result.map((k: Music, i: number) => (
            <div key={i} onClick={() => selectMusic(+k.MID)}>
              <MusicSearchItem
                name={k.name}
                singer={k.singer}
                thumbnail={k.thumbnail}
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
        <CircleButton size="45px" colorP={'#b6bac4'} onClick={addMusicInPlayList}>
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
`;

const ResultWrapper = styled(Layout)`
  line-height: 1.2rem;
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
    background: #e8ecee;
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
