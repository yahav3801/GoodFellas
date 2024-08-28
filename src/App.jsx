// App.js
import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import AllPostsPage from './pages/allPostsPage';
import SinglePostPage from './pages/singlePostPage';
import OrgDashboard from './pages/orgDashboard';
import Login from './pages/login';
import Signup from './pages/signup';
import NoPage from './pages/noPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PostPage from './pages/postPage';
import '../tailwind.config';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<AllPostsPage />} />
            <Route path="login" element={<Login />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="signup" element={<Signup />} />
            <Route path="post" element={<SinglePostPage />} />
            <Route path="dashboard" element={<OrgDashboard />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;