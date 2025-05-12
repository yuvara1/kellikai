import React, { useState } from 'react';
import './feed.css';
import { AiFillLike } from "react-icons/ai";
import axios from 'axios';

function Feed(props) {
     const host = import.meta.env.VITE_HOST;
     const [userId, setUserId] = useState(localStorage.getItem('user_id')); // Get user ID from local storage
     const [likes, setLikes] = useState(props.likes || 0); // Initialize likes with the value from props
     const [liked, setLiked] = useState(false); // Track if the user has liked the post

     const handleLike = async () => {
          if (liked) return; // Prevent multiple likes

          try {
               const response = await axios.post(`${host}/likepost`, {
                    post_id: props.id, // Pass the post ID
                    user_id: userId, // Pass the user ID
               }, {
                    headers: {
                         Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
               });
               if (response.status === 200) {
                    setLikes(likes + 1); // Increment likes
                    setLiked(true); // Mark as liked
               } else {
                    console.error('Error liking post:', response);
               }
          } catch (error) {
               console.error('Error liking post:', error);
          }
     };

     return (
          <>
               <div className='post'>
                    <div className='profile'>
                         <div>
                              <img
                                   className='userlogo'
                                   src={props.profileImage || 'https://via.placeholder.com/50'}
                                   alt={`${props.username || 'Unknown User'}'s profile`}
                                   height="50px"
                                   width="50px"
                              />
                              <p>{props.username}</p>
                         </div>
                    </div>

                    <img
                         className='usercontent'
                         src={props.content}
                         alt="Post content"
                    />
                    <p>{props.caption}</p>
                    <div className='like'>
                         <p>{likes}</p>
                         <AiFillLike
                              className={`likebutton ${liked ? 'liked' : ''}`}
                              onClick={handleLike}
                         />
                    </div>
               </div>
          </>
     );
}

export default Feed;