import React, { HtmlHTMLAttributes } from "react";
import {useState, useRef, useEffect} from "react"
import {io} from "socket.io-client";
import styles from "./style.module.scss";
import * as _ from "lodash"
const socket = io();
interface chatType{
    id :number;
    msg:string;
}
type event = React.ChangeEvent<HTMLInputElement>;
function ChatComponent() {
    const [chats, setChats] = useState<chatType[]>([]);
    const [newChat, setNewChat] = useState<string>("");
    const chatListRef = useRef();
    const idRef = useRef<number>(0)
    useEffect(() => {
        socket.on("chatMessage", ({id, msg}) => {
            const curChat = _.cloneDeep(chats);
            curChat.push({id:id, msg:msg});
            setChats(curChat);
        });
    }, [chats]);
    
    function MakeChatList(){
        const chatlist = chats.map((chat, idx)=>{
            return(
                <li>
                    {chat.msg}
                </li>
            );
        })
        return <ul>{chatlist}</ul>
    }
    const changeHandler = (e:event) => {
        setNewChat(e.target.value);
    };
    const clickHandler =()=>{
        socket.emit('chatMessage', newChat);
        const curChat = _.cloneDeep(chats);
        curChat.push({id:-1, msg:newChat});
        setNewChat('');
        setChats(curChat);
    }
    const keyUpHandler=(e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === "Enter"){
            clickHandler();
        }
    }
    return(
        <div className={styles.chatBox} >
            <div className={styles.chatList}>
                <MakeChatList/>
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
                    <button >send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
