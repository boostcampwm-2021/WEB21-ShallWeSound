import React, { useState, useRef } from 'react';
import UploadModal from './UploadModal';
import { timeoutRef } from '../../types';
import { RouteComponentProps } from 'react-router';
import CreateRoomButton from './CreateRoomButton';
import { withRouter } from 'react-router-dom';
import { useSocket } from '../../context/MyContext';
import UserButton from './UserButton';
import { Socket } from 'socket.io-client';
import { useMediaQuery } from 'react-responsive';

function HeaderComponent({ history }: { history: RouteComponentProps['history'] }) {
  const socket: Socket = useSocket()!;
  const timerRef = useRef<timeoutRef>({
    timer: setTimeout(() => {
      /*this is empty timer*/
    }),
  });
  const [searchInput, setSearchInput] = useState('');
  const [toggle, setToggle] = useState(false);

  function searchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timerRef.current) {
      clearTimeout(timerRef.current.timer!);
    }
    const searchTimer = setTimeout(() => {
      setSearchInput(e.target.value);
    }, 17);
    timerRef.current.timer = searchTimer;
  }

  function goMain() {
    if (window.location.pathname.includes('room')) socket.emit('leaveRoom');

    history.push(`/main`);
  }

  function doSearch() {
    if (searchInput) {
      if (window.location.pathname.includes('room')) socket.emit('leaveRoom');
      history.push(`/result/${searchInput}`);
    }
  }

  function searchInputSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      doSearch();
    }
  }

  const isPC = useMediaQuery({
    query: '(min-width: 900px)',
  });

  return (
    <div className="header">
      <img className="header-logo" src="/images/logo.png" alt="logo" onClick={goMain} />
      <div className="header-left-wrap">
        {(isPC || toggle) && (
          <>
            <UserButton history={history} />
            <UploadModal />
            <CreateRoomButton history={history} />
          </>
        )}
      </div>
      <div className="header-search">
        <input
          className="header-search-input"
          type="text"
          placeholder="검색어를 입력하세요"
          onChange={searchInputChange}
          onKeyPress={searchInputSubmit}
        />
        <img src="/icons/search.svg" alt="search" onClick={doSearch} />
      </div>
      {!isPC &&
      <div className="menu header-button" onClick={() => setToggle(prev => !prev)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        <p>메뉴</p>
      </div>
      }
    </div>
  );
}

export default withRouter(HeaderComponent);
