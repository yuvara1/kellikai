import React, { useEffect } from 'react'
import { BiSolidUserMinus } from "react-icons/bi";
import Navbar from '../routes/NavBar';
import SideBar from '../routes/SideBar';
import Users from '../routes/Users';
import axios from 'axios';
import { useFetcher } from 'react-router-dom';

function follows(props) {
     const host = import.meta.env.VITE_HOST;
     console.log('propes: ' + props);
     console.log('props id: ' + props.id);
     console.log(localStorage.getItem('user_id'));

     useEffect(() => {
          const fetchFollowings = async () => {
               try {
                    const response = await axios.get(`${host}/followings`, {
                         params: { follower_id: localStorage.getItem('user_id') ? localStorage.getItem('user_id') :-1 }, // Pass follower_id dynamically
                         headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                         },
                    });
                    console.log(response.data);
               } catch (error) {
                    console.error('Error fetching followings:', error);
               }
          }
          fetchFollowings();
     }, []); // Run only once on component mount
     function handleRemove() {
          console.log('remove');
          const response = axios.delete(`${host}/unfollow`, {
               params: { follower_id: localStorage.getItem('user_id'), following_id: props.id },
               headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
          }).then((res) => {
               if (res.status === 200) {
                    // alert('Unfollowed successfully!');
                    window.location.reload(); // Reload the page after a successful unfollow
               }
               console.log(res.data);
          }).catch((err) => {
               console.log(err);
          });
     }
     const styles = {
          box: {
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               borderBottom: '1px solid grey'

          },
          list: {
               display: 'flex',
               alignItems: 'center'
          },
          img: {
               height: '50px',
               width: '50px',
               borderRadius: '50%',
               margin: '10px'
          },

          icon: {
               height: '40px',
               width: '40px'
          }
     };
     return (
          <>
               <Navbar />
               <SideBar />

               <div style={styles.box}>
                    <div style={styles.list}>
                         <img style={styles.img} src={props.img} alt="" />
                         <p style={styles.p}>{props.username}</p>
                    </div>
                    <BiSolidUserMinus style={styles.icon} onClick={handleRemove} />

               </div>
               <Users />
          </>
     )
}
follows.defaultProps = {
     img: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
     username: 'user'
}
export default follows;
