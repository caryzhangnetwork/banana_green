import React, { createContext, useState } from 'react';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Home.css';
export const profileMenuContext = createContext("");

export const Home = () => {
  const user = JSON.parse(localStorage.getItem('user')),
  //const userQuote = useSelector((state) => state.user.quote);

  profileItems = [{
    id: 1,
    itemName: '任务',
    linkUrl: '/home/itemlist',
    rotation: 45
  }, {
    id: 2,
    itemName: '事务', 
    linkUrl: '/home/itemdetail',
    rotation: 135
  }, {
    id: 3,
    itemName: '记事',
    linkUrl: '/home/usermemo',
    rotation: 225
  }, {
    ud: 4,
    itemName: '日历',
    linkUrl: '',
    rotation: 315
  }];

  return (
    <profileMenuContext.Provider value={profileItems}>
      <div>
        <div className="header">
          {/* <div className="nameTitle">{user.name}</div> */}
          <div className="profileContainer">
            <ProfileMenu/>
          </div>
          
          <div className="quotesContainer">
            <div className="quotesTitle">我相信...</div>
            <div className="quotesBody">
              {/* {userQuote} */}
            </div>
          </div>
        </div>

        <div className="contentBody">
          <Outlet/>
        </div>
      </div>
    </profileMenuContext.Provider>
  );
};

export default Home;
