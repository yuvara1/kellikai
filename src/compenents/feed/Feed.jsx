import React, { useState } from 'react';
import './feed.css';
import { AiFillLike } from "react-icons/ai";
import axios from 'axios';

function Feed(props) {
     const [likes, setLikes] = useState(props.likes || 0); // Initialize likes with the value from props
     const [liked, setLiked] = useState(false); // Track if the user has liked the post

     const handleLike = async () => {
          if (liked) return; // Prevent multiple likes

          try {
               await axios.post('https://kellikai.onrender.com/likepost', {
                    post_id: props.id, // Pass the post ID
               });
               setLikes(likes + 1); // Increment likes locally
               setLiked(true); // Mark as liked
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
                                   src={props.profileImage}
                                   alt={`${props.username}'s profile`}
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