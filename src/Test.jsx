import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageComponent = ({ postId }) => {
     const host = import.meta.env.VITE_HOST;
     const [imageSrc, setImageSrc] = useState(null);

     useEffect(() => {
          const fetchImage = async () => {
               try {
                    const response = await axios.get(`${host}/getimage/${postId}`, {
                         responseType: 'arraybuffer', // Get the image as binary data
                    });

                    const blob = new Blob([response.data], { type: 'image/jpeg' });
                    const url = URL.createObjectURL(blob);
                    setImageSrc(url); // Set the image URL for display
               } catch (error) {
                    console.error('Error fetching image:', error);
               }
          };

          fetchImage();
     }, [postId]);

     return (
          <div>
               {imageSrc ? <img src={imageSrc} alt="Post" /> : <p>Loading image...</p>}
          </div>
     );
};

export default ImageComponent;