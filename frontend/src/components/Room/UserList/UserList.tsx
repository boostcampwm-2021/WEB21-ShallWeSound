import React, { useEffect, useState } from 'react';
import '../../../stylesheets/userList.scss';
import config from '../../../config.host.json';
import { useSocket } from '../../../context/MyContext';
const UserList = ({ user }: { user: string[] }) => {
  const socket: any = useSocket();

  const userList = user.map((val, idx) => {
    if (idx === 0 && val === socket.id) return <li>👑 {val} (나)</li>;
    else if (idx === 0) return <li>👑 {val} </li>;
    else if (val === socket.id) return <li>🧑 {val} (나)</li>;
    else return <li>🧑 {val}</li>;
  });

  return (
    <div className={'userList'}>
      <h3>참가자 {user.length}명</h3>
      <br />
      <ul>{userList}</ul>
    </div>
  );
};

export default UserList;
