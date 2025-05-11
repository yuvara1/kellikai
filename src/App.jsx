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

function App() {
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;