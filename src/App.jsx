import React, { useEffect } from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import { Route, Routes, useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // const loggedIn = checkUserLoginStatus(); // 检查用户登录状态的函数
    // if (loggedIn) {
    //   navigate('/home');
    // } else {
    //   navigate('/'); 
    // }
  }, [navigate]);

  const checkUserLoginStatus = () => {
    const user = localStorage.getItem('user');
    if (user !== undefined && JSON.parse(user)) {
      return true; // 假设用户已登录
    } else {
      return false; 
    }
  };

  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
