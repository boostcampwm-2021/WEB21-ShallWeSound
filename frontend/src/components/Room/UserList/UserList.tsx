import React from 'react';
import '../../../stylesheets/userList.scss';
import { Socket } from 'socket.io-client';
import { useSocket } from '../../../context/MyContext';
import ScrollBar from '../../Util/scrollbar';
import UserItem from './UserItem';

const UserList = ({ user, isHost }: { user: string[]; isHost: boolean }) => {
  const socket: Socket = useSocket();

  const userList = user.map((val, idx) => {
    if (idx === 0 && val === socket.id) return `👑 ${val} (나)`;
    else if (idx === 0) return `👑 ${val}`;
    else if (val === socket.id) return `🧑 ${val} (나)`;
    else return `🧑 ${val}`;
  });

  return (
    <div className={'userList'}>
      <h3>참가자 {user.length}명</h3>
      <br />
      <ScrollBar>
        <ul>
          {userList.map((userName, idx) => (
            <>
              <UserItem userString={userName} userName={user[idx]} isHost={isHost} />
            </>
          ))}
        </ul>
      </ScrollBar>
    </div>
  );
};

export default UserList;
