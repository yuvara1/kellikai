import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Feed from '../feed/Feed';
import Navbar from '../routes/NavBar';
import SideBar from '../routes/SideBar';
import Users from '../routes/Users';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Post.css';

const Post = () => {
  const host = import.meta.env.VITE_HOST;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  useEffect(() => {
    setData([]);
    setPage(1);
  }, [localStorage.getItem('user_id')]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      const res = await axios.get(`${host}/getallposts?page=${page}&limit=${limit}&user_id=${userId}`);
      const posts = Array.isArray(res.data.posts) ? res.data.posts : [];
      setData(prev => [...prev, ...posts]);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [host, page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const lastPostRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0].isIntersecting && data.length < total) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, data.length, total]
  );

  // Skeletons for loading state
  const skeletonArray = Array.from({ length: limit }).map((_, idx) => (
    <div className="post" key={`skeleton-${idx}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: 18 }}>
        <Skeleton circle height={48} width={48} />
        <Skeleton height={24} width={120} />
      </div>
      <Skeleton height={180} style={{ borderRadius: 14, margin: '18px 0' }} />
    </div>
  ));

  return (
    <SkeletonTheme baseColor="#23233a" highlightColor="#ff6f61">
      <Navbar />
      <SideBar />
      <div id="post" data-aos="zoom-in" data-aos-duration="3000" data-aos-delay="3000">
        {data.map((post, idx) => {
          if (idx === data.length - 1) {
            return (
              <div ref={lastPostRef} key={post.id}>
                <Feed
                  id={post.id}
                  profileImage={post.profile}
                  username={post.name}
                  content={post.img}
                  caption={post.caption}
                  likes={post.likes}
                  liked={post.liked}
                />
              </div>
            );
          }
          return (
            <Feed
              key={post.id}
              id={post.id}
              profileImage={post.profile}
              username={post.name}
              content={post.img}
              caption={post.caption}
              likes={post.likes}
              liked={post.liked}
            />
          );
        })}
        {loading && skeletonArray}
      </div>
      <Users />
    </SkeletonTheme>
  );
};

export default Post;