import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './compenents/auth/Login.jsx';
import Upload from './compenents/upload/Upload.jsx';
import GenAI from './compenents/GenAI/GenAI.jsx';
import Post from './compenents/post/Post.jsx';
import Followers from './compenents/follows/Follwers.jsx';
import Register from './compenents/auth/Register.jsx';
import Chat from './compenents/chat/Chat.jsx';
import PageNotFound from './compenents/page not found/PageNotFound.jsx';
import PrivateRoute from './compenents/routes/PrivateRoute.jsx';
import Test from './Test.jsx';
function App() {
  const styles = {
    main: {
      display: 'flex',
      backgroundColor: 'black',
      height: ' 100vh',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      padding: '20px',
    }
  }

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    return (
      <div style={styles.main}>
        <div>
          <h1>Mobile Version</h1>
          <p>Sorry, this application is not available on mobile devices.</p>
          <p>Please use a desktop or laptop to access the full features.</p>
          <p>Thank you for your understanding!</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/post"
            element={
              <PrivateRoute>
                <Post />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            }
          />
          <Route
            path="/followers"
            element={
              <PrivateRoute>
                <Followers />
              </PrivateRoute>
            }
          />
          <Route
            path="/GenAI"
            element={
              <PrivateRoute>
                <GenAI />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          {/* Catch-All Route */}
          <Route path="*" element={<PageNotFound />} />
          <Route path='/img' element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;