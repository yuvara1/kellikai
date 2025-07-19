import React from "react";
import axios from "axios";
import { HiUserAdd } from "react-icons/hi";
import { useEffect } from "react";
const Friends = (props) => {
     const host = import.meta.env.VITE_HOST;
     const { id, img, username, followedUsers } = props;

     console.log('Props:', props.id);

     function addFollow() {
          const userId =  localStorage.getItem('user_id');
          console.log('User ID:', userId);
          const token = localStorage.getItem('token');

          console.log('User ID:', userId);
          console.log('Token:', token);
          console.log('Followed User ID:', id);

          axios.post(`${host}/followuser`, {
               follower_id: userId, // Send follower_id
               followed_id: id, // Send followed_id
          }, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          })
               .then((res) => {
                    if (res.status === 200) {
                         alert('Followed successfully!');
                         window.location.reload(); // Reload the page after a successful follow
                    } else if (res.status === 409) {
                         alert('You are already following this user.');
                    } else {
                         alert('An error occurred while trying to follow the user.');
                    }
               })
               .catch((err) => {
                    console.error('Error:', err);
                    alert('Failed to follow user. Please try again later.');
               });
     }

     const styles = {
          box: {
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between', // Space between elements
               borderBottom: '1px solid grey',
               padding: '10px', // Add padding for better spacing
          },
          img: {
               height: '3rem',
               width: '3rem',
               borderRadius: '50%',
               marginRight: '15px', // Add margin to the right of the image
          },
          p: {
               flex: 1, // Allow the username to take up available space
               margin: '0 .3rem', // Add horizontal margin
               fontSize: '1rem', // Adjust font size for better readability
          },
          icon: {
               height: '2rem',
               width: '2rem',
               marginLeft: '15px', // Add margin to the left of the icon
               cursor: 'pointer', // Add pointer cursor for better UX
          },
     };
     return (
          <div style={styles.box}>
               <img style={styles.img} src={img} alt="User" />
               <p style={styles.p}>{username}</p>
               {/* Conditionally render the "Add User" button */}
               <div>
                    {!followedUsers.includes(id) && (
                         <HiUserAdd
                              style={styles.icon}
                              onClick={addFollow}
                         />
                    )}
               </div>
          </div>
     );
};

// Default props to handle missing values
Friends.defaultProps = {
     id: null,
     img: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
     username: 'Unknown User',
     followedUsers: [], // Default to an empty array
};

export default Friends;