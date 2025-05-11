import React, { useState } from 'react';
import Navbar from '../routes/NavBar';
import SideBar from '../routes/SideBar';
import Users from '../routes/Users';
import '../GenAI/genStyle.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BiSend } from "react-icons/bi";

const Music = () => {
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    const promptElement = document.getElementById('prompt');
    const prompt = promptElement.value;

    if (prompt === '') {
      promptElement.placeholder = 'Please enter a prompt.';
      alert('just ask anything...');
      return;
    }

    setLoading(true);
    promptElement.value = '';
    const outputs = document.getElementById('res');

    const p = document.createElement('p');
    p.className = 'promptText';
    p.innerHTML = prompt;
    outputs.appendChild(p);

    const genAI = new GoogleGenerativeAI("AIzaSyA94j7VV6LmHdTm5F_rLgKcmFpNbHRkwhM");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const responseP = document.createElement('p');
    responseP.className = 'responseText';
    responseP.innerHTML = 'Loading...';
    outputs.appendChild(responseP);

    // Scroll to the bottom of the outputs element
    outputs.scrollTop = outputs.scrollHeight;

    try {
      const result = await model.generateContent(prompt);
      responseP.innerHTML = result.response.text();
      responseP.className = 'responseText show';
      console.log(result.response.text());
    } catch (error) {
      console.error(error);
      responseP.innerHTML = 'An error occurred. Please try again.';
      responseP.className = 'responseText show';
    } finally {
      setLoading(false);
      // Scroll to the bottom of the outputs element
      outputs.scrollTop = outputs.scrollHeight;
    }
  };

  return (
    <>
      <Navbar />
      <SideBar />
      <div id='container'>
        <h1 className='h1'>Ask anything to Me !</h1>
        <div id='form'>
          <div id="res"></div>
        </div>
        <div id="ask">
          <textarea type="text" id='prompt' placeholder='just ask....'></textarea>
          <BiSend className='button' onClick={handleAsk} />
        </div>
      </div>
      <Users />
    </>
  );
};

export default Music;