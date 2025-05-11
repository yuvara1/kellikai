import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Feed from '../feed/Feed';
import Navbar from '../routes/NavBar';
import SideBar from '../routes/SideBar';
import Users from '../routes/Users';
import './Post.css';

const Post = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://kellikai.onrender.com/getallposts');
        setData(response.data);
        console.log('Fetched posts:', response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <SideBar />
      <div id="post" data-aos="zoom-in" data-aos-duration="3000" data-aos-delay="3000">
        {data.map(post => (
          <Feed
            key={post.id}
            id={post.id} // Pass the post ID
            profileImage={post.profile || 'https://via.placeholder.com/50'} // Fallback for profile image
            username={post.name || 'Unknown User'} // Fallback for username
            content={post.img || 'https://via.placeholder.com/500'} // Fallback for post image
            caption={post.caption || 'No caption provided'} // Fallback for caption
            likes={post.likes || 0} // Fallback for likes
          />
        ))}
      </div>
      <Users />
    </>
  );
};

export default Post;