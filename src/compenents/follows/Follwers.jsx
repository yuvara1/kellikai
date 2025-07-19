import React, { useEffect, useState } from 'react';
import img from './rabit.jpg';
import Follows from './Follows';
import axios from 'axios';
import SideBar from '../routes/SideBar';
import Navbar from '../routes/NavBar';
import Users from '../routes/Users';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Follwers() {
  const host = import.meta.env.VITE_HOST;
  const [followings, setFollowings] = useState([]);
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  const styles = {
    box: {
      position: "absolute",
      top: "11vh",
      left: "31%",
      padding: "10px 10px",
      margin: "0 auto",
      color: "white",
      borderRadius: "10px",
      overflowY: "scroll",
      zIndex: "-1",
      backgroundColor: "black",
      width: "40%",
      height: "87vh"
    },
    heading: {
      padding: '10px'
    }
  };

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const response = await axios.get(`${host}/followings`, {
          params: { follower_id: localStorage.getItem('user_id') ? localStorage.getItem('user_id') : -1 }, // Pass follower_id dynamically
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 404) {
          setError('No followings found');
          setLoading(false);
          return;
        }

        setFollowings(response.data);
        setLoading(false);
        console.log(localStorage);
      } catch (error) {
        console.error('Error fetching followings:', error);
        setError('Error fetching followings');
        setLoading(false);
      }
    };

    fetchFollowings();
  }, []); // Run only once on component mount

  const list = followings.map((follower) => (
    <Follows
      key={follower.id}
      id={follower.id}
      img={follower.user_photo ? follower.user_photo : img}
      username={follower.name}
    />
  ));

  return (
    <div>
      <Navbar />
      <SideBar />
      <div style={styles.box}>
        <h1 style={styles.heading}>My Followers</h1>
        {error ? (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        ) : loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
              <Skeleton circle height={50} width={50} style={{ marginRight: 15 }} />
              <Skeleton height={18} width={120} />
            </div>
          ))
        ) : (
          list
        )}
      </div>
      <Users />
    </div>
  );
}

export default Follwers;