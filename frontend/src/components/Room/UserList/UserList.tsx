import React, { useEffect, useState } from 'react';
import '../../../stylesheets/userList.scss';
import config from '../../../config.host.json';

const UserList = ({ user }: { user: string[] }) => {
  useEffect(() => {});

  return (
    <div className={'userList'}>
      <h3>참가자 {user.length}명</h3>
      <ul>
        {user.map(val => (
          <li>{val}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
