import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import config from '../../config.host.json';
import SearchBar from '../Util/SearchBar';
import MusicSearchItem from './MusicSearchItem';
import CircleButton from '../Util/CircleButton';
import { useSocket } from '../../context/MyContext';

interface Music {
  MID: number;
  name: string;
  thumnail: string;
  singer: string;
  description: string;
  path: string;
}

interface State {
  keyword: string;
  result: Music[];
  selectedMusics: number[];
  isFetch: boolean;
}

const MusicSearch = () => {
  const socket: any = useSocket();
  const page = useRef(0);
  const [state, setState] = useState<State>({
    keyword: '',
    result: [],
    selectedMusics: [],
    isFetch: false,
  });

  const fetchMusic = useCallback(async () => {
    if (!state.isFetch) return;

    const res = await fetch(`${config.localhost}/api/music?keyword=${state.keyword}&page=${page.current}`);
    const musics = await res.json();

    setState({ ...state, result: [...state.result, ...musics], isFetch: false });
  }, [state]);

  useEffect(() => {
    fetchMusic();
  }, [fetchMusic]);

  useEffect(() => {
    page.current = state.result.length;
  }, [state.result]);

  const addMusicInPlayList = () => {
    socket.emit('addMusicInPlayListReq', state.selectedMusics);

    setState({
      ...state,
      selectedMusics: [],
    });
  };

  const onScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const isEndOfScroll = e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight;

    if (isEndOfScroll) {
      setState({
        ...state,
        isFetch: true,
      });
    }
  };

  const isSelected = (MID: number): boolean => (state.selectedMusics.indexOf(MID) >= 0 ? true : false);

  const selectMusic = (MID: number) => {
    if (state.selectedMusics.indexOf(MID) >= 0) {
      setState({
        ...state,
        selectedMusics: state.selectedMusics.filter(id => id !== MID),
      });
    } else {
      setState({
        ...state,
        selectedMusics: [...state.selectedMusics, MID],
      });
    }
  };

  const onKeywordChange = (value: string) => {
    setState({
      keyword: value,
      result: [],
      selectedMusics: [],
      isFetch: true,
    });
  };

  const { result } = state;

  return (
    <Layout>
      <SearchBar onKeywordChange={onKeywordChange} />
      <ResultWrapper onScroll={onScroll}>
        {result.length ? (
          result.map((k: Music, i: number) => (
            <div key={i} onClick={() => selectMusic(+k.MID)}>
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
