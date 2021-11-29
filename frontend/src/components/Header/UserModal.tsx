import React, { useState } from "react";
import { RouteComponentProps } from 'react-router';
import { Cookies } from 'react-cookie';

function UserModal({ onClose, history }: { onClose: () => void, history: RouteComponentProps['history'] }) {
  const cookies = new Cookies();

  function Logout () {
    cookies.remove('jwt');
    cookies.remove('userID');
    window.location.href="https://shallwesound.p-e.kr/login";
  }

  return (
    <div className="modal">
      <div className="modal-close" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </div>
      <p className="modal-title">안녕하세요,<br/>{cookies.get('userID')} 님!</p>
      <div className="input-wrap">
        {/* <label>e-mail</label>
        <p>blahblah@blahblah.com</p> */}
        <div className="header-button" onClick={Logout}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
          <p>로그아웃</p>
        </div>
      </div>
    </div>
  );
}

function UserButton ({ history }: { history: RouteComponentProps['history'] }) {
  const [viewModal, setViewModal] = useState(false);

  function appearModal() {
    setViewModal(true);
  }

  function disappearModal() {
    setViewModal(false);
  }
  return (
    <div className="modal-container">
      <button className="header-button" onClick={appearModal}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <p>사용자</p>
      </button>
      {viewModal && <UserModal onClose={disappearModal} history={history} />}
    </div>
  )
}

export default UserButton;
