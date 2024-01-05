import React, { useEffect, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import axios from 'axios';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import {authSignOut,authSignOutRejected,authSignOutComplete} from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';

const socket = io.connect('https://gpt-backend-mrz4.onrender.com/');

const Chat = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [emptyMessage, setEmptyMessage] = useState(false);
  const msgEnd = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [chatMessages]);

  const handleSubmit = async () => {
    if (userPrompt.trim() !== '') {
      const content = userPrompt;
      const user = localStorage.getItem('current_user') || {};
      setUserPrompt('');
      const newMessage = { role: 'user', content };
      setChatMessages((prev) => [...prev, newMessage]);
      socket.emit('send_message', { message: newMessage, user });
      const response = await axios.post('https://gpt-backend-mrz4.onrender.com/chat/new', {
        userPrompt,
      });
      const getMessage = { role: 'assistant', content: response.data };
      setChatMessages((prev) => [...prev, getMessage]);
      socket.emit('received_message', { message: getMessage, user });
    } else {
      setEmptyMessage(true);
    }
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const user = localStorage.getItem('current_user') || {};
        const response = await axios.get(
          `https://gpt-backend-mrz4.onrender.com/${user}`
        );
        const data = await response.data;
        data.chats.map((chat) => {
          const oldMessage = chat;
          setChatMessages((prev) => [...prev, oldMessage]);
          return '';
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      dispatch(authSignOut());
      const res = await axios.post('https://gpt-backend-mrz4.onrender.com/user/logout');
      const data = await res.data;
      if (data.success === false) {
        dispatch(authSignOutRejected(data.message));
        return;
      }
      localStorage.clear();
      dispatch(authSignOutComplete(data));
      navigate('/');
    } catch (error) {
      dispatch(authSignOutRejected(error.message));
    }
  };


  return (
    <div className="chatpage-container">
      <div className="card">
        <div className="chat-details">
 

          <div className="chat-intro">
            <div className="chat-intro-inner">
              <div className="chat-intro-container">
                <h1 className="chat-intro-heading">ChatGPT Clone</h1>
                <div className="chat-conversation">
                  {chatMessages.map((chat, index) => (
                    <ChatHistory
                      content={chat.content}
                      role={chat.role}
                      key={index}
                    />
                  ))}
                  <div ref={msgEnd} />
                </div>
              </div>
              <div className="submit-conversation">
                <input
                  type="text"
                  required
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (e.target.value.trim() === '') {
                        setEmptyMessage(true);
                      } else {
                        handleSubmit();
                      }
                    }
                  }}
                />
                <button type="submit" onClick={handleSubmit}>
                  <IoMdSend />
                </button>
                
              </div>
              {emptyMessage && (
                <p style={{ color: 'red' }}>Please enter your query!</p>
              )}
              
            </div>
          </div>
          <div className="chat-banner">
              <button onClick={handleSignOut}>LogOut</button>
            </div>
        </div>        
      </div>      
    </div>
  );
};

export default Chat;
