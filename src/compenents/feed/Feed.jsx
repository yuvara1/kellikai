import React, { useState, useEffect, useCallback, memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AiFillLike } from "react-icons/ai";
import axios from 'axios';
import './feed.css';

const Feed = memo(function Feed(props) {
     const host = import.meta.env.VITE_HOST;
     const [likes, setLikes] = useState(props.likes || 0);
     const [liked, setLiked] = useState(props.liked || false);
     const [isLoading, setIsLoading] = useState(false);
     const userId = localStorage.getItem('user_id');

     // Sync liked state with props
     useEffect(() => {
          setLiked(props.liked || false);
          setLikes(props.likes || 0);
     }, [props.liked, props.likes, props.id]);

     const handleLike = useCallback(async () => {
          if (!userId || isLoading) return;

          setIsLoading(true);

          try {
               const endpoint = liked ? `${host}/unlikepost` : `${host}/likepost`;
               const response = await axios.post(endpoint, {
                    post_id: props.id,
                    user_id: userId,
               });

               if (response.status === 200) {
                    setLikes(prevLikes => liked ? Math.max(prevLikes - 1, 0) : prevLikes + 1);
                    setLiked(prevLiked => !prevLiked);
               }
          } catch (error) {
               console.error('Error updating like status:', error);
          } finally {
               setIsLoading(false);
          }
     }, [liked, host, props.id, userId, isLoading]);

     // Skeleton loading effect for post (when like/unlike is processing)
     if (isLoading) {
          return (
               <div className="post">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: 18 }}>
                         <Skeleton circle height={48} width={48} />
                         <Skeleton height={24} width={120} />
                    </div>
                    <Skeleton height={180} style={{ borderRadius: 14, margin: '18px 0' }} />
               </div>
          );
     }

     return (
          <article className='post'>
               <header className='profile'>
                    <div>
                         <img
                              className='userlogo'
                              src={props.profileImage}
                              alt={`${props.username}'s profile`}
                              height="50"
                              width="50"
                              loading="lazy"
                         />
                         <h3>{props.username}</h3>
                    </div>
               </header>

               <figure>
                    <img
                         className='usercontent'
                         src={props.content}
                         alt={props.caption || "Post content"}
                         loading="lazy"
                    />
                    {props.caption && <figcaption>{props.caption}</figcaption>}
               </figure>

               <div className='like'>
                    <span aria-live="polite" style={{ border: 'none' }}>{likes}</span>
                    <button
                         className={`likebutton ${liked ? 'liked' : ''}`}
                         onClick={handleLike}
                         disabled={isLoading}
                         aria-label={liked ? "Unlike post" : "Like post"}
                         aria-pressed={liked}
                    >
                         <AiFillLike aria-hidden="true" />
                    </button>
               </div>
          </article>
     );
});

export default Feed;

