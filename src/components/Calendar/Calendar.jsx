import React, { useState, useEffect } from 'react';
import { WeeklyDetail } from "../Calendar/WeeklyCalendar/WeeklyDetail/WeeklyDetail";
import { WeeklyCalendar } from "../Calendar/WeeklyCalendar/WeeklyCalendar";
import { DailyCalendar } from "../Calendar/DailyCalendar/DailyCalendar";

export const Calendar = () => {
  useEffect(() => {

  },[]);
  const [isDailyCalendar, setIsDailyCalendar] = useState(true),

  switchCalendar = () => {
    setIsDailyCalendar(isDailyCalendar ? false : true)
  }

  
  return (
    <>
      <button onClick={switchCalendar}>switch</button>
      {
        isDailyCalendar
       ? 
      <DailyCalendar/> :
      <WeeklyCalendar/> 
      }
    </>
  );
};

export default Calendar;
