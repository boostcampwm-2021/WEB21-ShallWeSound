import React, { HtmlHTMLAttributes } from "react";
import {useState, useRef, useEffect} from "react"
import {io} from "socket.io-client";
const socket = io();
type event = React.ChangeEvent<HTMLInputElement>;
function ChatComponent() {
    // interface chatInterface{
    //     [id:number]:string
    // }
    const [chats, setChats] = useState<string[]>([]);
    const [newChat, setNewChat] = useState<string>("");
    const chatListRef = useRef();
    const idRef = useRef<number>(0)
    useEffect(() => {
        socket.on("chat", (message:string) => {
            // idRef.current = idRef.current+1;
            // const curId = idRef.current
            const curChat = [...chats, message];
            setChats(curChat);
        });
    
        // const chatList:any = chatListRef.current;
        // chatList.scrollTop = chatList.scrollHeight;
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
    function ChatForm(){

    }
    const changeHandler = (e:event) => {
        setNewChat(e.target.value);
    };
    const clickHandler =()=>{
        socket.emit('chatMessage', newChat);
        const curChat = [...chats,newChat ]
        setChats(curChat);
        setNewChat('');
    }
    return(
        <div className='chatBox'>
            <MakeChatList/>
            <form>
                <input type="text"
                placeholder="message"
                onChange={changeHandler}
                />
                <button onClick={clickHandler}>send</button>
            </form>
        </div>
    );
}

export default ChatComponent;
