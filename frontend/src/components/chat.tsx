import React, { HtmlHTMLAttributes } from "react";
import {useState, useRef, useEffect} from "react"
import {io} from "socket.io-client";
import styles from "./style.module.scss";
const socket = io();
type event = React.ChangeEvent<HTMLInputElement>;
function ChatComponent() {
    const [chats, setChats] = useState<string[]>([]);
    const [newChat, setNewChat] = useState<string>("");
    const chatListRef = useRef();
    const idRef = useRef<number>(0)
    useEffect(() => {
        socket.on("chatMessage", ({id, msg}) => {
            console.log('userid : ', id);
            const curChat = [...chats, msg];
            console.log(curChat);
            setChats(curChat);
        });
    }, [chats]);
    
    function MakeChatList(){
        const chatlist = chats.map((chat, idx)=>{
            return(
                <li>
                    {chat}
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
        const curChat = [...chats,newChat]
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
