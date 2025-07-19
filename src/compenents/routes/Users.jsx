import React, { useState, useEffect, useCallback, memo } from "react";
import './Users.css';
import Friends from '../follows/Friendslist';
import axios from "axios";
import img from './rabit.jpg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Users = () => {
  const host = import.meta.env.VITE_HOST;
  const [followings, setFollowings] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('user');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Parallel API calls for better performance
        const [usersResponse, followingsResponse] = await Promise.all([
          axios.get(`${host}/getallusers?name=${username}`, { signal }),
          axios.get(`${host}/followings`, {
            params: { follower_id: userId },
            signal
          })
        ]);

        setFollowings(usersResponse.data);

        const followedIds = followingsResponse.data.map((user) => user.id);
        setFollowedUsers(followedIds);

        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Error fetching user data:', err);
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId && username) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [host, userId, username]);

  const renderContent = useCallback(() => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <Skeleton circle height={48} width={48} style={{ marginRight: 15 }} />
          <Skeleton height={18} width={120} />
        </div>
      ));
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (followings.length === 0) {
      return <div className="empty-message">No users found</div>;
    }

    return followings.map((user) => (
      <Friends
        key={user.id}
        id={user.id}
        img={user.user_photo || img}
        username={user.name}
        followedUsers={followedUsers}
      />
    ));
  }, [followings, followedUsers, loading, error]);

  return (
    <div
      id="users"
      className="users-container"
      data-aos="fade-left"
      data-aos-duration="1500"
      data-aos-delay="200"
      role="complementary"
      aria-label="User suggestions"
    >
      <h2 id="p" className="section-title">Netizens</h2>
      {renderContent()}
    </div>
  );
}

export default memo(Users);
