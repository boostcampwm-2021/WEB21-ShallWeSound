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
  const timerRef = useRef<timeoutRef>({ timer: setTimeout(() => {}) });
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
    if (window.location.pathname.includes('room')) socket.emit('leaveRoom');

    history.push(`/result/${searchInput}`);
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
        {isPC || toggle ? (
          <>
            <UserButton history={history} />
            <UploadModal />
            <CreateRoomButton history={history} />
          </>
        ) : null}
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
      <div className="menu" onClick={() => setToggle(prev => !prev)}>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
      </div>
    </div>
  );
}

export default withRouter(HeaderComponent);
