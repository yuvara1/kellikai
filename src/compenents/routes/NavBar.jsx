import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { BiSearch } from "react-icons/bi";
import './NavBar.css';
import axios from "axios";

const Navbar = () => {
     const host = import.meta.env.VITE_HOST;
     const navigate = useNavigate();
     const [showLogOut, setShowLogOut] = useState(false);
     const [photo, setPhoto] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [avatarUrl, setAvatarUrl] = useState(null);
     const [avatarLoading, setAvatarLoading] = useState(true);
     const user = localStorage.getItem('user');

     // Debounced search for better performance
     const debounce = useCallback((func, delay) => {
          let timer;
          return function (...args) {
               clearTimeout(timer);
               timer = setTimeout(() => func.apply(this, args), delay);
          }
     }, []);

     // Effect for fetching profile picture with proper cancellation
     useEffect(() => {
          setAvatarLoading(true);
          const controller = new AbortController();

          const fetchProfilePic = async () => {
               try {
                    if (!user) return;

                    // Request as text, not blob
                    const response = await axios.get(`${host}/profilePic?name=${user}`, {
                         signal: controller.signal,
                         responseType: 'text'
                    });

                    // If response is a base64 string, setPhoto
                    if (response.data) {
                         setPhoto(response.data);
                    } else {
                         setPhoto(localStorage.getItem('photo') || '/default-avatar.png');
                    }
               } catch (error) {
                    if (!axios.isCancel(error)) {
                         console.error('Error fetching profile picture:', error);
                    }
               } finally {
                    setAvatarLoading(false);
               }
          };

          fetchProfilePic();

          // Click outside handler for logout dropdown
          const handleClickOutside = (event) => {
               if (showLogOut && !event.target.closest('.user') && !event.target.closest('.logout')) {
                    setShowLogOut(false);
               }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => {
               controller.abort();
               document.removeEventListener('mousedown', handleClickOutside);
          }
     }, [user, showLogOut, host]);

     useEffect(() => {
          if (photo && typeof photo === 'string') {
               // If photo is a base64 string, use it directly
               setAvatarUrl(photo.startsWith('data:image') ? photo : `data:image/jpeg;base64,${photo}`);
          } else {
               setAvatarUrl(localStorage.getItem('photo') || '/default-avatar.png');
          }
     }, [photo]);

     const handleLogOutClick = useCallback(() => {
          setShowLogOut(prevState => !prevState);
     }, []);

     const handleLogOut = useCallback(() => {
          localStorage.clear();
          navigate('/');
     }, [navigate]);

     // Debounced search handler
     const debouncedSearchChange = useMemo(() =>
          debounce(value => {
               // Here you could add API calls for search functionality
               setSearchTerm(value);
          }, 300), [debounce]);

     const handleSearchChange = useCallback((e) => {
          debouncedSearchChange(e.target.value);
     }, [debouncedSearchChange]);

     // Memoized avatar with fallbacks
     const userAvatar = useMemo(() =>
          photo || localStorage.getItem('photo') || '/default-avatar.png',
          [photo]);

     return (
          <nav className="navbar" role="navigation" aria-label="main navigation">
               <div>
                    <Link id='Link' to={'/post'} aria-label="Go to home page">
                         <img
                              className="logo"
                              src="/newk.jpeg"
                              alt="Kellikai Logo"
                              loading="eager"
                              width="40"
                              height="40"
                         />
                    </Link>
               </div>

               <div className="search-container">
                    <BiSearch className="search-icon" aria-hidden="true" />
                    <input
                         type="text"
                         id="search"
                         placeholder="Search..."
                         onChange={handleSearchChange}
                         aria-label="Search users or posts"
                    />
               </div>

               <div>
                    <div
                         className="user"
                         onClick={handleLogOutClick}
                         role="button"
                         tabIndex={0}
                         aria-haspopup="true"
                         aria-expanded={showLogOut}
                         onKeyDown={(e) => { if (e.key === 'Enter') handleLogOutClick() }}
                    >
                         <p>{user}</p>
                         {avatarLoading ? (
                              <div className="i skeleton" style={{ width: 32, height: 32 }} />
                         ) : (
                              <img
                                   className="i"
                                   src={avatarUrl}
                                   alt={`${user}'s profile`}
                                   loading="lazy"
                                   width="32"
                                   height="32"
                              />
                         )}

                    </div>
                    {showLogOut && (
                         <div
                              className="logout"
                              onClick={handleLogOut}
                              role="menu"
                              tabIndex={-1}
                              aria-label="User menu"
                         >
                              <p role="menuitem" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleLogOut() }}>Log Out</p>
                         </div>
                    )}
               </div>
          </nav>
     );
};

export default memo(Navbar);
