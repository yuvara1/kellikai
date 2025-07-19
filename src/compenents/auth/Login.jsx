import './login.css';
import google from './google.png';
import facebook from './facebook.png';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { LoginSocialFacebook } from 'reactjs-social-login';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Login = () => {
  const host = import.meta.env.VITE_HOST;
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const userRef = useRef(null);
  const passRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = {
      email: userRef.current.value, // Use ref directly
      password: passRef.current.value,
    };
    setUserName(user.email);
    setPassword(user.password);

    try {
      setLoading(true);
      const response = await axios.post(`${host}/login`, user);
      localStorage.setItem('user_id', response.data.id);
      localStorage.setItem('user', response.data.name);
      localStorage.setItem('photo', response.data.user_photo);
      navigate('/post');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        document.getElementById('user').style.display = 'block';
        document.getElementById('passs').style.display = 'none';
      } else {
        console.error('Error during login:', error);
      }
    } finally {
      setLoading(false);
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
        await axios.post(`${host}/googlelogin`, {
          name: response.data.name,
          email: response.data.email,
          photo: response.data.picture,
        })
          .then((res) => {
            if (res.status === 409) {
              alert('Invalid email');
            } else {
              console.log(res.data);
              localStorage.setItem('user_id', res.data.id);
              localStorage.setItem('user', res.data.name);
              localStorage.setItem('photo', res.data.user_photo || response.data.picture);
              setTimeout(() => {
                navigate('/post');
              }, 200);
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const facebookLogin = (res) => {
    axios.post(`${host}/facebooklogin`, {
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
          localStorage.setItem('user_id', response.data.id);
          localStorage.setItem('user', res.name);
          localStorage.setItem('photo', res.picture.data.url);
          navigate('/post');
        } else {
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem('user', res.name);
          localStorage.setItem('photo', res.picture.data.url);
          navigate('/post');
        }
      })
      .catch((error) => {
        console.error('Error during Facebook login:', error);
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
              <input
                type="text"
                ref={userRef}
                autoComplete='username'
                id="name"
                className='input'
              />
              <label className='label'>username or email</label>
              <p id='user' className='invalid'>invalid username or email try again!</p>
            </div>

            <div className='inputBlock'>
              <input
                ref={passRef}
                autoComplete='current-password'
                type="password"
                id='pass'
                className='input'
              />
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
          {loading && (
            <div>
              <Skeleton height={40} style={{ width: '100%', marginBottom: 16 }} />
              <Skeleton height={40} style={{ width: '100%', marginBottom: 16 }} />
              <Skeleton height={40} style={{ width: '60%', marginBottom: 16 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;