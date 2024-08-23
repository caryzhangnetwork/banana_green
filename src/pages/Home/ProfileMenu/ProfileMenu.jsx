import React, { useState, useEffect, useContext } from 'react';
import { profileMenuContext } from "../Home"
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileIndex } from '../../../redux/menuSlice';

import './ProfileMenu.css';

const ProfileMenu = () => {
  const [rotation, setRotation] = useState(45),
  profileItems = useContext(profileMenuContext),
  navigate = useNavigate(),
  dispatch = useDispatch(),
  profileIndex = useSelector((state) => state.menu.profileIndex),

  rotateAnimation = { transform: `rotate(${rotation}deg)`, transition: 'transform 1s ease' },
  revertRotateAnimation = { transform: `rotate(-${rotation}deg)`, transition: 'transform 1s ease' };

  useEffect(() => {
    if (profileItems[profileIndex].isMenuItem) {
      navigate(profileItems[profileIndex].linkUrl); 
    }
  }, [navigate]);

  // update rotation base on profileIndex changed
  useEffect(() => {
    if (profileItems[profileIndex].isMenuItem) {
      const newRotation = profileItems[profileIndex].rotation;
      setRotation(newRotation);
    }
  }, [profileIndex]);

  const renderItemList = () => {
    return <div className="circle-container profileButton clickButton" 
      onMouseDown={handleMouseDown} 
      style={rotateAnimation}>
      {
        profileItems.map((item, idx) => {
          return <div className={`button${idx + 1} cirvle-angle-btn ${idx === profileIndex ? 'activeBtn' : null}`} key={item.itemName}>
            <span style={revertRotateAnimation}>{item.itemName}</span>
          </div>
        })
      } 
    </div>
  }

  const handleMouseDown = () => {
    const menuItems = profileItems.filter(item => item.isMenuItem)
    const currentIdx = profileIndex + 1 < menuItems.length ? profileIndex + 1 : 0;
    dispatch(updateProfileIndex(currentIdx))

    if (menuItems[currentIdx].isMenuItem) {

      navigate(menuItems[currentIdx].linkUrl)
    }

  };

  return (
    <div className='profileContainer'>
      {renderItemList()}
    </div>
  );
};



export default ProfileMenu;