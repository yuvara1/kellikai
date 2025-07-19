import React, { useState } from 'react';
import Navbar from "../routes/NavBar.jsx";
import SideBar from "../routes/SideBar.jsx";
import Users from '../routes/Users.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Upload = () => {
     const host = import.meta.env.VITE_HOST;
     const [image, setImage] = useState(null);
     const [caption, setCaption] = useState('');
     const [preview, setPreview] = useState(null); // Store the image preview URL
     const [loading, setLoading] = useState(false); // Track loading state

     const styles = {
          postField: {
               position: "absolute",
               top: "10vh",
               left: "31%",
               textAlign: "center",
               padding: "10px 10px",
               margin: "0 auto",
               color: "white",
               borderRadius: "10px",
               overflowY: "scroll",
               zIndex: "-1",
               backgroundColor: "black",
               width: "40%",
               height: "88%",
          },
          form: {
               border: "1px solid white",
               height: "86%",
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-evenly',
               alignItems: 'center'
          },
          dropzone: {
               border: '2px dashed white',
               borderRadius: '10px',
               padding: '20px',
               textAlign: 'center',
               cursor: 'pointer',
               marginBottom: '20px',
               color: 'white',
          },
          preview: {
               width: '100px',
               height: '100px',
               objectFit: 'cover',
               borderRadius: '10px',
               marginTop: '10px',
          },
          caption: {
               display: 'flex',
               flexDirection: 'column',
               width: '200px',
               height: "auto",
               padding: '1rem',
               gap: "20px",
               border: '1px solid white'
          },
          text: {
               width: "auto",
               height: "auto",
               resize: "none",
               padding: '10px',

          },
          button: {
               backgroundColor: 'white',
               color: 'black',
               width: '50%',
               padding: '8px',
               border: '1px solid black',
               borderRadius: '5px',
               cursor: 'pointer',
               opacity: loading ? 0.6 : 1, // Change opacity when loading
               pointerEvents: loading ? 'none' : 'auto', // Disable pointer events when loading
          },
          h1: {
               padding: '20px'
          },
     };

     const Navigation = useNavigate();

     const onDrop = (acceptedFiles) => {
          const file = acceptedFiles[0];
          setImage(file); // Store the file
          setPreview(URL.createObjectURL(file)); // Generate a preview URL
     };

     const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          accept: 'image/*', // Accept only image files
          multiple: false, // Allow only one file
     });

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData();
          formData.append('name', localStorage.getItem('user'));
          formData.append('image', image);
          formData.append('caption', caption);

          try {
               const response = await axios.post(`${host}/uploadpost`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
               });
               if (response.data === 'Post created successfully') {
                    Navigation('/post');
               }
          } catch (error) {
               console.error(error);
          } finally {
               setLoading(false);
          }
     };

     return (
          <>
               <Navbar />
               <SideBar />
               <div style={styles.postField}>
                    <h1 style={styles.h1}>Post your thoughts</h1>
                    {loading ? (
                         <div>
                              <Skeleton height={100} width={100} style={{ borderRadius: 10, margin: '10px auto' }} />
                              <Skeleton height={40} style={{ width: '80%', marginBottom: 16 }} />
                              <Skeleton height={40} style={{ width: '60%', marginBottom: 16 }} />
                         </div>
                    ) : (
                         <form style={styles.form} onSubmit={handleSubmit}>
                              {/* Drag-and-Drop Area */}
                              <div {...getRootProps()} style={styles.dropzone}>
                                   <input {...getInputProps()} />
                                   {preview ? (
                                        <img src={preview} alt="Preview" style={styles.preview} />
                                   ) : (
                                        <p>Drag & drop an image here, or click to select</p>
                                   )}
                              </div>
                              <div style={styles.caption}>
                                   <label htmlFor="caption">Caption for your post: </label>
                                   <textarea style={styles.text} type="text" name="caption" id="caption" placeholder='Share your thoughts...' onChange={(e) => setCaption(e.target.value)} />
                              </div>
                              <input
                                   id='submitbutton'
                                   style={styles.button}
                                   type="submit"
                                   value={loading ? "Uploading..." : "Upload"} // Change button text when loading
                                   disabled={loading} // Disable the button when loading
                              />
                         </form>
                    )}
               </div>
               <Users />
          </>
     );
}

export default Upload;