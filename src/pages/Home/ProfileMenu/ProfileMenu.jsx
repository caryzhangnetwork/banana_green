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
    const param = profileItems[profileIndex].id === 2 ? '/false' : '';
    navigate(profileItems[profileIndex].linkUrl + param); 
  }, [navigate]);

  //update rotation base on profileIndex changed
  useEffect(() => {
    const newRotation = profileItems[profileIndex].rotation;
    setRotation(newRotation);
  }, [profileIndex]);

  const renderItemList = () => {
    return <div className="circle-container profileButton clickButton" 
      onMouseDown={handleMouseDown} 
      style={rotateAnimation}>
      {
        profileItems.map((item, idx) => {
          return <div className={`button${idx + 1} cirvle-angle-btn`} key={item.itemName}>
            <span style={revertRotateAnimation}>{item.itemName}</span>
          </div>
        })
      } 
    </div>
  }

  const handleMouseDown = () => {
    const currentIdx = profileIndex + 1 < profileItems.length ? profileIndex + 1 : 0,
    param = profileItems[currentIdx].id === 2 ? '/false' : '';
    setRotation(profileItems[currentIdx].rotation); // 更新旋转角度
    dispatch(updateProfileIndex(currentIdx))

    navigate(profileItems[currentIdx].linkUrl + param)
  };

  return (
    <div className='profileContainer'>
      {renderItemList()}
    </div>
  );
};



export default ProfileMenu;