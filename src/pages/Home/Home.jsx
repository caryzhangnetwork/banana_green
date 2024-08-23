import React, { createContext, useEffect } from 'react';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import { getUserProfile } from '../../apis/userApis'
import { updateQuote } from '../../redux/userSlice';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import './Home.css';
export const profileMenuContext = createContext("");

export const Home = () => {
  // production
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     const userProfile = await getUserProfile();
  //     dispatch(updateQuote(userProfile.quotes))
  //   };
  //   fetchUserProfile(); 
  // },[]);
  const dispatch = useDispatch(),
  user = JSON.parse(localStorage.getItem('user')),
  userQuote = useSelector((state) => state.user.quote),

  profileItems = [
    {
      id: 1,
      itemName: '日历',
      linkUrl: '/home/calendar',
      rotation: 135,
      isMenuItem: true
    }, 
    {
      id: 2,
      itemName: '记事', 
      linkUrl: '/home/usermemo',
      rotation: 315,
      isMenuItem: true
    }, {
    id: 3,
    itemName: '任务',
    linkUrl: '/home/itemlist',
    rotation: 45,
    isMenuItem: true
  },
  {
    id: 4,
    itemName: '小任务',
    linkUrl: '/home/itemdetail',
    rotation: 135,
    isMenuItem: false
  }
  ];

  return (
    <profileMenuContext.Provider value={profileItems}>
      <div>
        <div className="header">
          {/* <div className="nameTitle">{user.name}</div> */}
          <div className="profileContainer">
            <ProfileMenu/>
          </div>
          
          <div className="quotesContainer">
            <div className="quotesBody">
              {userQuote}
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
