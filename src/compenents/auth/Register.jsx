import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Register = () => {
  const host = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [image, setImage] = useState(null); // Store the uploaded image
  const [preview, setPreview] = useState(null); // Store the image preview URL
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const validate = (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    // Validate password match
    if (password !== confirmPass) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true); // Set loading to true on form submission

    // Create FormData to send user data and image
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('user_photo', image); // Append the image file

    axios
      .post(`${host}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setLoading(false); // Reset loading state
        if (response.status === 200) {
          // alert('User registered successfully');
          navigate('/'); // Redirect to login page
        }
      })
      .catch((error) => {
        setLoading(false); // Reset loading state
        if (error.response && error.response.status === 409) {
          setErrorMessage('User already exists');
        } else {
          setErrorMessage('An error occurred during registration. Please try again.');
        }
      });
  };

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

  return (
    <div style={{ overflow: 'hidden' }}>
      <div id="login">
        <div id="clon"></div>
        <div id="bodyform">
          <form onSubmit={validate}>
            <p className="name">The Latest and Greatest Memes.</p>
            <p className="name">KELLIKKAI</p>
            <p className="name">Register</p>

            {/* Drag-and-Drop Area */}
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Preview" className="preview" />
              ) : (
                <p>Drag & drop your profile picture here, or click to select</p>
              )}
            </div>

            <div>
              <input
                className="Input"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={20}
                minLength={4}
              />
              <label className="Label">Enter your Full Name</label>
            </div>
            <div>
              <input
                className="Input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="Label">Enter E-mail</label>
            </div>
            {/* <div>
              <input
                className="Input"
                type="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label className="Label">Enter Phone Number</label>
            </div> */}
            <div>
              <input
                className="Input"
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="Label">Password</label>
            </div>
            <div>
              <input
                className="Input"
                type="password"
                id="confirmPass"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
              <label className="Label">Confirm Password</label>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {loading ? (
              <div>
                <Skeleton circle height={100} width={100} style={{ margin: '10px auto' }} />
                <Skeleton height={40} style={{ width: '100%', marginBottom: 16 }} />
                <Skeleton height={40} style={{ width: '100%', marginBottom: 16 }} />
                <Skeleton height={40} style={{ width: '60%', marginBottom: 16 }} />
              </div>
            ) : (
              <button id="submit" type="submit">
                Register Now
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;