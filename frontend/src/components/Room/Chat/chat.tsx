import React from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from '../../../stylesheets/style.module.scss';
import * as _ from 'lodash';
import { useSocket } from '../../../context/MyContext';
import { Socket } from 'socket.io-client';

interface chatType {
  id: number;
  msg: string;
}
type event = React.ChangeEvent<HTMLInputElement>;
function ChatComponent() {
  const socket: Socket = useSocket()!;
  const [chats, setChats] = useState<chatType[]>([]);
  const [newChat, setNewChat] = useState<string>('');
  const chatListRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    socket?.on('chatMessage', ({ id, msg }: chatType) => {
      const curChat = _.cloneDeep(chats);
      curChat.push({ id: id, msg: msg });
      setChats(curChat);
    });
    scrollToBottom();

    return () => {
      socket.off('chatMessage');
    };
  }, [chats]);

  function MakeChatList() {
    const chatlist = chats.map((chat, idx) => {
      if (chat.id !== -1) {
        const writer = `by ${chat.id}`;
        return (
          <div className={styles.msgBallon} key={idx}>
            <div className={styles.writer}>{writer}</div>
            <div className={styles.othersChat}>{chat.msg}</div>
          </div>
        );
      } else {
        return (
          <div className={styles.msgBallon} key={idx}>
            <div className={styles.myChat}>{chat.msg}</div>
          </div>
        );
      }
    });
    return <div>{chatlist}</div>;
  }
  const changeHandler = (e: event) => {
    setNewChat(e.target.value);
  };
  const clickHandler = () => {
    socket?.emit('chatMessage', newChat);
    const curChat = _.cloneDeep(chats);
    curChat.push({ id: -1, msg: newChat });
    setNewChat('');
    setChats(curChat);
  };
  const keyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      clickHandler();
    }
  };
  return (
    <div className={styles.chatBox}>
      <div className={styles.chatList} ref={chatListRef}>
        <MakeChatList />
      </div>
      <div className={styles.chatInputSquare}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="message"
          value={newChat}
          onChange={changeHandler}
          onKeyPress={keyUpHandler}
        />
        <div onClick={clickHandler}>
          <button>send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
