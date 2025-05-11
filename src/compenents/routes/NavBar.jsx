import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import Cookie from 'js-cookie';
import axios from "axios";

export default function Navbar() {
     const navigate = useNavigate();
     const [showLogOut, setShowLogOut] = useState(false); // State to toggle logout visibility
     const [photo, setPhoto] = useState(null); // State to store the user's profile photo

     // Fetch the user's profile photo
     useEffect(() => {
          const fetchPhoto = async () => {
               try {
                    const response = await axios.get(
                         `https://kellikai.onrender.com/profilePic?name=${localStorage.getItem('user')}`,
                         {
                              headers: {
                                   Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                         }
                    );
                    setPhoto(response.data); // Set the photo URL
               } catch (error) {
                    console.error('Error fetching profile photo:', error);
               }
          };

          fetchPhoto();
     }, []); // Empty dependency array ensures this runs only once

     // Handle logout menu toggle
     function handleLogOutClick() {
          setShowLogOut(!showLogOut); // Toggle the logout menu
     }

     // Handle user logout
     function handleLogOut() {
          console.log('Photo URL before logout:', localStorage.getItem('photo'));
          localStorage.clear(); // Clear user data
          Cookie.remove('id'); // Remove the cookie
          navigate('/'); // Redirect to the login page
     }

     return (
          <nav className="navbar" data-aos="fade-down" data-aos-duration="3000">
               <div>
                    <Link id='Link' to={'/post'}>
                         <img className="logo" src="/newk.jpeg" alt="logo" height={'50px'} width={'50px'} />
                    </Link>
               </div>

               <div>
                    <input type="text" id="search" placeholder="Search...." />
               </div>

               <div>
                    <div className="user" onClick={handleLogOutClick}>
                         <p>{localStorage.getItem('user')}</p>
                         <img className="i" src={photo || '/default-profile.png'} alt="user" /> {/* Fallback to default image */}
                    </div>
                    {showLogOut && ( // Conditionally render the logout menu
                         <div className="logout" id="logout" onClick={handleLogOut}>
                              <p>Log Out</p>
                         </div>
                    )}
               </div>
          </nav>
     );
}