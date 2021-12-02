import { Socket } from 'socket.io-client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSocket } from '../../../context/MyContext';
const UserSelectModal = ({ userName, off }: { userName: string; off: Function }) => {
  const [color, setColor] = useState<string>('black');
  const socket: Socket = useSocket()!;
  const delegateEvent = () => {
    socket.emit('delegateManual', userName);
    off();
  };

  return (
    <>
      <Delegate
        onMouseOver={() => {
          setColor('#cdf0ea');
        }}
        onMouseLeave={() => {
          setColor('black');
        }}
        color={color}
        onClick={delegateEvent}
      >
        방장 위임
      </Delegate>
    </>
  );
};

const UserItem = ({ userString, userName, isHost }: { userString: string; userName: string; isHost: boolean }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const clickUserItem = () => {
    if (!userString.includes('👑')) isClicked ? setIsClicked(false) : setIsClicked(true);
  };

  const off = () => {
    setIsClicked(false);
  };

  return (
    <>
      <div>
        <span className={'userList-userItem'} onClick={clickUserItem}>
          {userString}
        </span>
        {isClicked && isHost ? <UserSelectModal userName={userName} off={off}></UserSelectModal> : null}
      </div>
    </>
  );
};

export default UserItem;

const Delegate = styled.span`
  position: absolute;
  padding-left: 15px;
  cursor: pointer;
  color: ${props => props.color};
`;
