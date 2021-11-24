import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../../context/MyContext";

function UserModal({ onClose }: { onClose: () => void }) {
  const socket: Socket = useSocket()!;

  return (
    <div className="modal">
      <div className="modal-close" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </div>
      <p className="modal-title">UserID</p>
      <div className="input-wrap">
        <label>e-mail</label>
        <p>blahblah@blahblah.com</p>
        <label>My Playlist</label>
        <p>list1</p>
        <p>list2</p>
      </div>
    </div>
  );
}

function UserButton () {
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
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <p>사용자</p>
      </button>
      {viewModal && <UserModal onClose={disappearModal} />}
    </div>
  )
}

export default UserButton;