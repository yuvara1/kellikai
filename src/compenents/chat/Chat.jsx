// import React, { useState, useEffect, useRef } from 'react';
// import './Chat.css';

// const Chat = ({ username }) => {
//      const [messages, setMessages] = useState([]);
//      const [input, setInput] = useState('');
//      const ws = useRef(null);

//      useEffect(() => {
//           ws.current = new WebSocket('ws://localhost:8080');

//           ws.current.onopen = () => {
//                console.log('WebSocket connection established');
//           };

//           ws.current.onmessage = (event) => {
//                const message = JSON.parse(event.data);
//                setMessages((prevMessages) => [...prevMessages, message]);
//           };

//           ws.current.onclose = () => {
//                console.log('WebSocket connection closed');
//           };

//           return () => {
//                ws.current.close();
//           };
//      }, []);

//      const handleSendMessage = () => {
//           if (input.trim()) {
//                const message = { text: input, sender: username };
//                ws.current.send(JSON.stringify(message));
//                setInput('');
//           }
//      };

//      return (
//           <div className="chat-container">
//                <div className="chat-messages">
//                     {messages.map((message, index) => (
//                          <div key={index} className={`chat-message ${message.sender === username ? 'own-message' : ''}`}>
//                               <strong>{message.sender}:</strong> {message.text}
//                          </div>
//                     ))}
//                </div>
//                <div className="chat-input">
//                     <input
//                          type="text"
//                          value={input}
//                          onChange={(e) => setInput(e.target.value)}
//                          placeholder="Type a message..."
//                     />
//                     <button onClick={handleSendMessage}>Send</button>
//                </div>
//           </div>
//      );
// };

// export default Chat;
import React from 'react'
import './chat.css'
function Chat() {
  return (
    <div className='chat'>
      <div>
        <h1>This Feature is Under
          development</h1>
        <div>
          <p>I am working on this feature of chat with friends.</p>
          <p>It will be available soon.</p>
          <p>Thank you for your patience.</p>
          <br />
          <br />
          <h3>In the meantime, feel free to explore other features of the app.</h3>
        </div>
      </div>
    </div>
  )
}

export default Chat
