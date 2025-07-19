import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../routes/NavBar';
import SideBar from '../routes/SideBar';
import Users from '../routes/Users';
import '../GenAI/genStyle.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BiSend, BiLoaderAlt } from "react-icons/bi";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GenAI = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [promptValue, setPromptValue] = useState('');
  const outputsRef = useRef(null);
  const promptRef = useRef(null);

  // Scroll to bottom whenever conversations change
  useEffect(() => {
    if (outputsRef.current) {
      outputsRef.current.scrollTop = outputsRef.current.scrollHeight;
    }
  }, [conversations]);

  const handlePromptChange = useCallback((e) => {
    setPromptValue(e.target.value);
  }, []);

  const handleAsk = useCallback(async () => {
    const prompt = promptValue.trim();

    if (!prompt) {
      // Focus input and show temporary placeholder message
      promptRef.current.placeholder = 'Please enter a prompt...';
      promptRef.current.focus();
      setTimeout(() => {
        promptRef.current.placeholder = 'just ask....';
      }, 2000);
      return;
    }

    setLoading(true);
    setPromptValue('');

    // Add user question to conversations
    setConversations(prev => [
      ...prev,
      { type: 'prompt', text: prompt }
    ]);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA94j7VV6LmHdTm5F_rLgKcmFpNbHRkwhM");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Add placeholder response immediately
      setConversations(prev => [
        ...prev,
        { type: 'response', text: 'Loading...', isLoading: true }
      ]);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Replace placeholder with actual response
      setConversations(prev =>
        prev.map((item, index) =>
          index === prev.length - 1 && item.isLoading
            ? { type: 'response', text: responseText, isLoading: false }
            : item
        )
      );

    } catch (error) {
      console.error(error);

      // Replace loading message with error
      setConversations(prev =>
        prev.map((item, index) =>
          index === prev.length - 1 && item.isLoading
            ? { type: 'response', text: 'An error occurred. Please try again.', isLoading: false, isError: true }
            : item
        )
      );
    } finally {
      setLoading(false);
      promptRef.current.focus();
    }
  }, [promptValue]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }, [handleAsk]);

  return (
    <>
      <Navbar />
      <SideBar />
      <div id='container' role="main">
        <h1 className='h1'>Ask anything to Me!</h1>
        <div id='form'>
          <div id="res" ref={outputsRef} className="conversation-container">
            {conversations.length === 0 ? (
              <div className="empty-conversation">
                <p>Start a conversation by typing your question below!</p>
              </div>
            ) : (
              conversations.map((message, index) => (
                <div
                  key={index}
                  className={`${message.type}Text ${message.isLoading ? 'loading' : ''} ${message.isError ? 'error' : ''}`}
                >
                  {message.text}
                </div>
              ))
            )}
          </div>
        </div>
        <div id="ask">
          <textarea
            ref={promptRef}
            type="text"
            id='prompt'
            placeholder='just ask....'
            value={promptValue}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Ask AI a question"
          />
          <button
            className='send-button'
            onClick={handleAsk}
            disabled={loading}
            aria-label="Send message"
          >
            {loading ? <BiLoaderAlt className='spinner' /> : <BiSend />}
          </button>
        </div>
      </div>
      <Users />
    </>
  );
};

export default GenAI;
