import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserProfile } from '../../apis/userApis'
import { updateQuote } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './UserMemo.css';

export const UserMemo = () => {
  // update quote to home page
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile();
      setReminderValue(userProfile.reminder)
      setQuoteValue(userProfile.quotes)
    };
    fetchUserProfile(); 
  },[]);

  const title = 'Note',
  [reminderValue, setReminderValue] = useState(''),
  [quoteValue, setQuoteValue] = useState(''),

  updateUserMemo = async () => {
    const updateSuccess = await updateUserProfile(
      {
        reminderValue: reminderValue,
        quoteValue: quoteValue
      }
    )
    if (updateSuccess) {
      dispatch(updateQuote(quoteValue))
    }
  }
  
  return (
    <>
      <div className="pageTitle">{title}</div>
      <FontAwesomeIcon className='editBtn' 
              icon={ faCheck } 
              onMouseDown={updateUserMemo}
            />
      <div className="containerTitle">Reminder</div>
      <textarea className="container" value={reminderValue} 
        onChange={(e) => setReminderValue(e.target.value)} />
      <div className="containerTitle">Quote</div>
      <textarea className="container" value={quoteValue} 
        onChange={(e) => setQuoteValue(e.target.value)} />
    </>
  );
};

export default UserMemo;
