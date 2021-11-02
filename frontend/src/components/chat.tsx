import React, { HtmlHTMLAttributes } from "react";
import {useState, useRef, useEffect} from "react"
import {io} from "socket.io-client";
const socket = io();
type event = React.ChangeEvent<HTMLInputElement>;
function ChatComponent() {
    const [chats, setChats] = useState<string[]>([]);
    const [newChat, setNewChat] = useState<string>("");
    const chatListRef = useRef();
    const idRef = useRef<number>(0)
    useEffect(() => {
        socket.on("chatMessage", (message:string) => {
            const curChat = [...chats, message];
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
    return(
        <div className='chatBox'>
            <div>
                <MakeChatList/>
            </div>
            <div>
                <input
                className="chatInput" 
                type="text"
                placeholder="message"
                value={newChat}
                onChange={changeHandler}
                />
                <button onClick={clickHandler}>send</button>
            </div>
        </div>
    );
}

export default ChatComponent;
