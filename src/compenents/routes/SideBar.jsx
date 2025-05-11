import React from 'react';
import { NavLink } from 'react-router-dom';
import { BiHome, BiExport, BiHeart, BiMusic, BiMessageSquareDetail } from "react-icons/bi";
import './Sidebar.css';

function SideBar() {
     return (
          <aside data-aos="fade-right" data-aos-duration="3000" data-aos-delay="2000" className="sidebar">
               <NavLink to="/post" className={({ isActive }) => isActive ? 'menu active' : 'menu'} title="Home">
                    <BiHome className="i" />
                    <p>Home</p>
               </NavLink>
               <NavLink to="/upload" className={({ isActive }) => isActive ? 'menu active' : 'menu'} title="Explore">
                    <BiExport className='i' />
                    <p>Post</p>
               </NavLink>
               <NavLink to="/followers" className={({ isActive }) => isActive ? 'menu active' : 'menu'} title='follows'>
                    <BiHeart className='i' />
                    <p>Followers</p>
               </NavLink>
               <NavLink to="/GenAI" className={({ isActive }) => isActive ? 'menu active' : 'menu'} title="Post a new photo">
                    <BiMusic className='i' />
                    <p>GenAI</p>
               </NavLink>
               <NavLink to="/chat" className={({ isActive }) => isActive ? 'menu active' : 'menu'} title="Chat">
                    <BiMessageSquareDetail className='i' />
                    <p>Chat</p>
               </NavLink>
          </aside>
     );
}

export default SideBar;