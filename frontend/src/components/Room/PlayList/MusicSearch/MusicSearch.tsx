import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import styled from 'styled-components';
import config from '../../../../config.host.json';
import SearchBar from '../../../Util/SearchBar';
import MusicSearchItem from './MusicSearchItem';
import CircleButton from '../../../Util/CircleButton';
import { useSocket } from '../../../../context/MyContext';
import PopUp from '../../../Util/PopUp';
import Loading from '../../../Util/Loading';
import { Music } from '../../../../types';
import { reducer as addMusicStatusReducer } from './reducer/addMusicState';
import { reducer as searchResultReducer } from './reducer/searchResult';

import { useInfiniteScroll } from '../../../../hooks/useinfiniteScroll';
import ScrollBar from '../../../Util/scrollbar';

const MusicSearch = () => {
  const socket: any = useSocket();
  const scrollBar = useRef<HTMLDivElement | null>(null);
  const page = useRef(0);
  const [keyword, setKeyword] = useState('');
  const [searchResult, dispatchSearchResult] = useReducer(searchResultReducer, {
    result: [],
    selectedMusicInResult: [],
    hasMore: false,
    loading: false,
  });
  const [addMusicState, dispatchAddMusicState] = useReducer(addMusicStatusReducer, {
    success: false,
    fail: false,
  });

  const { result, selectedMusicInResult, hasMore, loading } = searchResult;
  const { success, fail } = addMusicState;

  const fetchMusic = useCallback(
    async (more = true) => {
      dispatchSearchResult({ type: 'FETCH_LOADING' });
      try {
        const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}&page=${page.current}`);
        const json = await res.json();
        const musics = json.result;

        if (more) {
          dispatchSearchResult({ type: 'FETCH_MORE_SUCCESS', result: musics, hasMore: json.hasMore });
        } else {
          dispatchSearchResult({ type: 'FETCH_SUCCESS', result: musics, hasMore: json.hasMore });
          scrollBar.current?.scrollTo(0, 0);
        }
      } catch (e) {
        dispatchSearchResult({ type: 'INIT' });
      }
    },
    [keyword],
  );

  useEffect(() => {
    let popUpTimer: NodeJS.Timeout;

    socket.on('duplicatedMusicInPlayList', () => {
      dispatchAddMusicState({ type: 'FAILURE' });

      popUpTimer = setTimeout(() => {
        dispatchAddMusicState({ type: 'INIT' });
      }, 700);
    });

    socket.on('successAddMusic', () => {
      dispatchAddMusicState({ type: 'SUCCESS' });

      popUpTimer = setTimeout(() => {
        dispatchAddMusicState({ type: 'INIT' });
      }, 700);
    });

    return () => {
      socket.off('duplicatedMusicInPlayList');
      socket.off('successAddMusic');
      clearTimeout(popUpTimer);
    };
  }, [socket]);

  useEffect(() => {
    page.current = 0;
    fetchMusic(false);
  }, [fetchMusic]);

  useEffect(() => {
    page.current = result.length;
  }, [result]);

  const onKeywordChange = (value: string) => {
    setKeyword(value);
  };

  const isSelected = (MID: number): boolean => (selectedMusicInResult.indexOf(MID) >= 0 ? true : false);

  const onSelectMusic = (MID: number) => {
    if (isSelected(MID)) {
      const newSelectedList = selectedMusicInResult.filter((id: number) => id !== MID);
      dispatchSearchResult({ type: 'SELECT_MUSIC', selectedInResult: newSelectedList });
    } else {
      dispatchSearchResult({ type: 'SELECT_MUSIC', selectedInResult: [...selectedMusicInResult, MID] });
    }
  };

  const addMusicInPlayList = () => {
    socket.emit('addMusicInPlayListReq', selectedMusicInResult);

    dispatchSearchResult({ type: 'REQUEST_ADD_MUSIC_IN_PLAYLIST' });
  };

  const setObserveTarget = useInfiniteScroll(fetchMusic);

  if (fail) {
    return (
      <PopUpWrapper>
        <PopUp text={'이미 추가된 음악입니다!'} />
      </PopUpWrapper>
    );
  }

  if (success) {
    return (
      <PopUpWrapper>
        <PopUp text={'음악이 추가되었습니다!'} />
      </PopUpWrapper>
    );
  }

  return (
    <Layout>
      <SearchBar onKeywordChange={onKeywordChange} />
      <ResultWrapper>
        <ScrollBar color_={'#e8ecee'} ref={scrollBar}>
          {result.length
            ? result.map((music: Music, i: number) => (
                <MusicSearchItem
                  key={i}
                  name={music.name}
                  singer={music.singer}
                  thumbnail={music.thumbnail}
                  description={music.description}
                  selected={isSelected(+music.MID)}
                  onClick={() => onSelectMusic(+music.MID)}
                />
              ))
            : !loading && <div>검색 결과 없음</div>}
          <div ref={hasMore ? setObserveTarget : null}>&nbsp;</div>
          <Spinner>{loading ? <Loading /> : null}</Spinner>
        </ScrollBar>
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
  overflow-x: hidden;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
`;

const PopUpWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Spinner = styled.div`
  margin: 0 50.7%;
`;

export default MusicSearch;
