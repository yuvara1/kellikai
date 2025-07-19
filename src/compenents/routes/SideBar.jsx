import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { BiHome, BiExport, BiHeart, BiMusic, BiMessageSquareDetail } from "react-icons/bi";
import './Sidebar.css';

const SideBar = () => {
     const navItems = [
          { path: "/post", title: "Home", icon: BiHome, label: "Home" },
          { path: "/upload", title: "Create a post", icon: BiExport, label: "Post" },
          { path: "/followers", title: "View your followers", icon: BiHeart, label: "Followers" },
          { path: "/GenAI", title: "Generate AI content", icon: BiMusic, label: "GenAI" },
          { path: "/chat", title: "Chat with others", icon: BiMessageSquareDetail, label: "Chat" },
     ];

     return (
          <aside
               className="sidebar"
               role="navigation"
               aria-label="Main navigation"
               data-aos="fade-right"
               data-aos-duration="1500"
               data-aos-delay="200"
          >
               {navItems.map((item) => (
                    <NavLink
                         key={item.path}
                         to={item.path}
                         className={({ isActive }) => isActive ? 'menu active' : 'menu'}
                         title={item.title}
                         aria-label={item.title}
                    >
                         <item.icon className="i" aria-hidden="true" />
                         <p>{item.label}</p>
                    </NavLink>
               ))}
          </aside>
     );
}

export default memo(SideBar);