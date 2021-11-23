import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import styled from 'styled-components';
import config from '../../../../config.host.json';
import SearchBar from '../../../Util/SearchBar';
import MusicSearchItem from './MusicSearchItem';
import CircleButton from '../../../Util/CircleButton';
import { useSocket } from '../../../../context/MyContext';
import PopUp from '../../../Util/PopUp';
import { Music } from '../../../../types';
import { reducer as addMusicStatusReducer } from './reducer/addMusicState';
import { reducer as searchResultReducer } from './reducer/searchResult';

import { useInfiniteScroll } from '../../../../hooks/useinfiniteScroll';

const MusicSearch = () => {
  const socket: any = useSocket();
  const page = useRef(0);
  const [keyword, setKeyword] = useState('');
  const [searchResult, dispatchSearchResult] = useReducer(searchResultReducer, {
    result: [],
    selectedMusicInResult: [],
  });
  const [addMusicState, dispatchAddMusicState] = useReducer(addMusicStatusReducer, {
    success: false,
    fail: false,
  });

  const { result, selectedMusicInResult } = searchResult;
  const { success, fail } = addMusicState;

  const fetchMusic = useCallback(
    async (more = true) => {
      try {
        const res = await fetch(`${config.localhost}/api/music?keyword=${keyword}&page=${page.current}`);
        const musics = await res.json();

        if (more) {
          dispatchSearchResult({ type: 'FETCH_MORE_SUCCESS', result: musics });
        } else {
          dispatchSearchResult({ type: 'FETCH_SUCCESS', result: musics });
        }
      } catch (e) {
        dispatchSearchResult({ type: 'FETCH_FAILURE' });
      }
    },
    [keyword],
  );

  useEffect(() => {
    socket.on('duplicatedMusicInPlayList', () => {
      dispatchAddMusicState({ type: 'FAILURE' });

      setTimeout(() => {
        dispatchAddMusicState({ type: 'INIT' });
      }, 700);
    });

    socket.on('successAddMusic', () => {
      dispatchAddMusicState({ type: 'SUCCESS' });

      setTimeout(() => {
        dispatchAddMusicState({ type: 'INIT' });
      }, 700);
    });

    return () => {
      socket.off('duplicatedMusicInPlayList');
      socket.off('successAddMusic');
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
      dispatchSearchResult({ type: 'UNSELECT_MUSIC', selectedInResult: newSelectedList });
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
        {result.length ? (
          result.map((music: Music, i: number) => (
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
        ) : (
          <div>검색 결과 없음</div>
        )}
        <div ref={result.length ? setObserveTarget : null}>&nbsp;</div>
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

const PopUpWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default MusicSearch;
