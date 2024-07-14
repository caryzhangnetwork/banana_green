import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './UserMemo.css';

export const UserMemo = () => {
  // update quote to home page
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const fetchTotalScore = async () => {
  //     newTotalScore = await getTotalScore();
  //     dispatch(updateTotalScore(newTotalScore))
  //   };
  //   fetchTotalScore(); // 调用fetchTotalScore函数
  // });

  const title = 'Note',
  [reminderValue, setReminderValue] = useState(''),
  [quoteValue, setQuoteValue] = useState(''),


  handleReminderChange = (event) => {
    setReminderValue(event.target.value);
    // need api, update user reminder
  },
  handleQuoteChange = (event) => {
    setQuoteValue(event.target.value);
    // need api, update user quote
  }
  
  return (
    <>
      <div className="pageTitle">{title}</div>
      <div className="containerTitle">Reminder</div>
      <textarea className="container" value={reminderValue} onChange={handleReminderChange} />

      <div className="containerTitle">Quote</div>
      <textarea className="container" value={quoteValue} onChange={handleQuoteChange} />
    </>
  );
};

export default UserMemo;
