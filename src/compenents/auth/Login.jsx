import './login.css';
import google from './google.png';
import facebook from './facebook.png';
import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { data, Link, useNavigate } from 'react-router-dom';
import { LoginSocialFacebook } from 'reactjs-social-login';
import Cookie from 'js-cookie';
import { useEffect } from 'react';

const Login = () => {
  const host = import.meta.env.VITE_HOST;
  let [username, setUserName] = useState('');
  let [password, setPassword] = useState('');
  

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const user = {
      email: username, // Assuming username is the email
      password: password,
    };

    try {
      const response = await axios.post(host, user);


      // Save user data to localStorage
      localStorage.setItem('user_id', response.data.id);
      console.log(response.data.id);
      Cookie.set('id', response.data.id);
      localStorage.setItem('user', response.data.name);
      localStorage.setItem('photo', response.data.user_photo);

      console.log('User logged in:', response.data.name);
      navigate('/post'); // Redirect to the posts page
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        document.getElementById('user').style.display = 'block';
        document.getElementById('passs').style.display = 'none';
      } else {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
            },
          }
        );
        console.log('Google user data:', response.data);
        console.log('Sending to backend:', {
          name: response.data.name,
          email: response.data.email,
          photo: response.data.picture,
        });
        console.log(response.data.picture);
        await axios.post(`${host}/googlelogin`, {
          name: response.data.name,
          email: response.data.email,
          photo: response.data.picture,
        })
          .then((res) => {
            if (res.status == 409) {
              alert('Invalid email');
            }
            else {
              setTimeout(() => {
                Cookie.set('user_id', res.data.id);
                localStorage.setItem('user_id', res.data.id);
                localStorage.setItem('user', res.data.name);
                localStorage.setItem('photo', res.data.user_photo);
                console.log(res.data);
                Cookie.set('id', res.data.id);
                console.log(Cookie.get('id'));
                navigate('/post');
                window.location.reload();

              }, 500);

            }
          });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const facebookLogin = (res) => {
    axios.post(`${process.env.HOST}/facebooklogin`, {
      name: res.name,
      email: res.email,
      photo: res.picture.data.url,
    })
      .then((response) => {
        if (response.data === 'invalid email') {
          alert('Invalid email');
        } else if (
          response.data === 'User registered successfully' ||
          response.data === 'New user created successfully'
        ) {
          Cookie.set('id', response.data.id);
          localStorage.setItem('user_id', response.data.id);
          localStorage.setItem('user', res.name);
          localStorage.setItem('photo', res.picture.data.url);
          navigate('/post');
          window.location.reload();
        } else {
          // Handle case where user already exists
          Cookie.set('id', response.data.user_id);
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem('user', res.name);
          localStorage.setItem('photo', res.picture.data.url); // Ensure the photo URL is passed correctly
          navigate('/post');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error during Facebook login:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <div id='log' style={{ overflow: 'hidden' }}>
      <div id='clone'></div>
      <div id='login'>
        <div id="bodyform">
          <form>
            <p className="name">The Latest and Greatest Memes.</p>
            <p className="name">KELLIKKAI</p>

            <div className='inputBlock'>
              <input type="text" id="name" className='input' onChange={(e) => setUserName(e.target.value)} required />
              <label className='label'>username or email</label>
              <p id='user' className='invalid'>invalid username or email try again!</p>
            </div>

            <div className='inputBlock'>
              <input type="password" id='pass' className='input' onChange={(e) => setPassword(e.target.value)} required />
              <label className='label'>password</label>
              <p id='passs' className='invalid'>invalid password try again!</p>
            </div>
            <p className='forgot' onClick={() => alert('this is feature is under development')}>Forgot Password ?</p>
            <button id="submit" onClick={handleLogin}>LOGIN</button>
            <p className="name">click to to
              <Link to={"/register"}>
                <pre style={{ color: 'white', display: 'inline-block' }}>   Register New!</pre>
              </Link>
            </p>
            <p className="name">------sign up with------</p>
            <GoogleOAuthProvider clientId="206928147239-2nbvkuofc69tkpkkh4vb84nc4hia9bv0.apps.googleusercontent.com">
              <span className='span' onClick={() => login()}>
                <div>
                  <img className='icon' src={google} alt="" />
                </div>
                <p>Sign in with Google</p>
              </span>
            </GoogleOAuthProvider>
            <LoginSocialFacebook
              appId="1100692031363896"
              onResolve={(response) => {
                console.log(response.data);
                facebookLogin(response.data);
              }}
              onReject={(error) => {
                console.log(error);
              }}
            >
              <span className='span'>
                <div>
                  <img className='icon' src={facebook} alt="" />
                </div>
                <p>Sign in with Facebook</p>
              </span>
            </LoginSocialFacebook>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;