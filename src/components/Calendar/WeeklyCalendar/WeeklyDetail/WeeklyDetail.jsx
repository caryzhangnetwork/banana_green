import React, { useState } from 'react';
import * as d3 from 'd3';
import '../../Calendar.css';

export const WeeklyDetail = () => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(new Date());
  const [month, setMonth] = useState(0);
  const svgRef = React.useRef(null);

  const getWeekDates = (firstDay) => {
    const weekDates = [];
    const firstDayCopy = new Date(firstDay);
    const dayOfWeek = firstDayCopy.getDay();
    const diff = firstDayCopy.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0); // Adjust to Monday
    firstDayCopy.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayCopy);
      date.setDate(firstDayCopy.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const drawCalendar = () => {
    d3.select(svgRef.current).selectAll('*').remove(); // Remove old content

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', '98%')
      .attr('height', 700);

    const cellHeight = 100;
    const progressHeight = 8;
    const progressWidth = svgRef.current.clientWidth * .85

    svg.selectAll('.week-date')
      .data(getWeekDates(firstDayOfWeek))
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * cellHeight})`)
      .each(function(d, i) {
        d3.select(this)
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', '100%')
          .attr('height', cellHeight)
          .attr('fill', '#f9f9f9')
          .attr('stroke', '#ccc');

        for (let j = 0; j < 6; j++) {
          const color = d3.schemeCategory10[j];
          const progress = j * 20; // 进度条的进度
          const borderRadius = progressHeight / 2;

          d3.select(this)
            .append('rect')
            .attr('x', 70)
            .attr('y', cellHeight - 90 + j * 15)
            .attr('width', progressWidth)
            .attr('height', progressHeight)
            .attr('rx', borderRadius)
            .attr('fill', '#f0f0f0');

          d3.select(this)
            .append('rect')
            .attr('x', 70)
            .attr('y', cellHeight - 90 + j * 15)
            .attr('width', progressWidth * (progress / 100))
            .attr('height', progressHeight)
            .attr('rx', borderRadius)
            .attr('fill', color);
        }

        d3.select(this)
          .append('text')
          .attr('x', 25)
          .attr('y', 20)
          .text(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d.getDay()])
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('fill', '#333');

          d3.select(this)
          .append('text')
          .attr('x', 25)
          .attr('y', cellHeight / 2 - 5) // 调整位置以使日期和月份垂直居中
          .text(`${d.getMonth() + 1}/${d.getDate()}`) // 显示月份和日期
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', '16px')
          .attr('fill', '#333');
      });
  };

  React.useEffect(() => {
    drawCalendar();
  }, [firstDayOfWeek]);

  const prevWeek = () => {
    const newFirstDay = new Date(firstDayOfWeek);
    newFirstDay.setDate(firstDayOfWeek.getDate() - 7);
    
    // 如果新的第一天是上一个月的日期，更新月份
    if (newFirstDay.getMonth() !== firstDayOfWeek.getMonth()) {
      setMonth(month - 1);
    }
  
    setFirstDayOfWeek(newFirstDay);
  };
  
  const nextWeek = () => {
    const newFirstDay = new Date(firstDayOfWeek);
    newFirstDay.setDate(firstDayOfWeek.getDate() + 7);
  
    // 如果新的第一天是下一个月的日期，更新月份
    if (newFirstDay.getMonth() !== firstDayOfWeek.getMonth()) {
      setMonth(month + 1);
    }
  
    setFirstDayOfWeek(newFirstDay);
  };

  return (
    <div className="week-calendar">
      <div className="calendar-header">
        <h2>{d3.timeFormat('%Y')(new Date(2022, month))}</h2>
      </div>
      <div className="calendar-container" ref={svgRef}></div>
      <div className="week-controls">
        <button onClick={prevWeek}>Previous Week</button>
        <button onClick={nextWeek}>Next Week</button>
      </div>
    </div>
  );
};

export default WeeklyDetail;