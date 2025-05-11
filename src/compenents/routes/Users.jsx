import React, { useState, useEffect } from "react";
import './Users.css';
import Friends from '../follows/Friendslist';
import axios from "axios";
import img from './rabit.jpg';

export default function Users() {
  const [followings, setFollowings] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]); // State to store followed user IDs

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await axios.get(`https://kellikai.onrender.com/getallusers?name=${localStorage.getItem('user')}`);
        setFollowings(res.data);

        // Fetch the list of followed user IDs
        const followedRes = await axios.get('https://kellikai.onrender.com/followings', {
          params: { follower_id: localStorage.getItem('user_id') },
        });
        const followedIds = followedRes.data.map((user) => user.id);
        setFollowedUsers(followedIds); // Store followed user IDs
      } catch (err) {
        console.log(err);
      }
    };
    fetchFollowings();
  }, []);

  const list = followings.map((lists) => {
    return (
      <Friends
        key={lists.id}
        id={lists.id}
        img={lists.user_photo ? lists.user_photo : img}
        username={lists.name}
        followedUsers={followedUsers} // Pass followed user IDs as a prop
      />
    );
  });

  return (
    <>
      <div id="users" data-aos="fade-left" data-aos-duration="3000" data-aos-delay="2000">
        <p id="p">Followings</p>
        {list}
      </div>
    </>
  );
}