import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview';
import Login from './pages/Login';
import api from "./configs/api.js";
import { useDispatch } from 'react-redux';
import { login, setLoading } from "./app/features/authSlice.js";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        if (token) {
          const { data } = await api.get("/api/users/data", {
            headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
          });

          if (data.user) {
            dispatch(login({ token, user: data.user }));
          }
        }
      } catch (error) {
        console.log(error.response?.data || error.message);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getUserData();
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>
        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='register' element={<Login />} />
      </Routes>
    </>
  );
};

export default App;