import React, { useState } from 'react';
import * as d3 from 'd3';
import '../Calendar.css';

export const WeeklyCalendar = () => {
  const [month, setMonth] = useState(0);
  const svgRef = React.useRef();

  const getWeekCount = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const diff = firstDayOfMonth.getDay() - 1; // Adjust to Monday
    const totalDays = lastDayOfMonth.getDate() + diff;
    return Math.ceil(totalDays / 7);
  };

  const drawCalendar = () => {
    d3.select(svgRef.current).selectAll('*').remove(); // Remove old content

    const weekCount = getWeekCount(2022, month);
    const canvasHeight = 25;
    const canvasWidth = svgRef.current.clientWidth * .95
    const cellWidth = canvasWidth / weekCount;
    const cellHeight = 270;
    const progressBarWidth = cellWidth * 0.90;


    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', '98%')
      .attr('height', cellHeight);

    svg.selectAll('.week-cell')
      .data(Array.from({ length: weekCount }, (_, i) => i))
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * cellWidth}, 0)`)
      .each(function(d, i) {
        d3.select(this)
          .append('rect')
          .attr('x', (d, i) => `${i * cellWidth}`)
          .attr('y', 0)
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('fill', '#f9f9f9')
          .attr('stroke', '#ccc');

        for (let j = 0; j < 6; j++) {
          const color = d3.schemeCategory10[j];
          const progress = j * 20; // 进度条的进度
          const borderRadius = canvasHeight / 2;

          d3.select(this)
            .append('rect')
            .attr('x', 5)
            .attr('y',  45 + j * 35)
            .attr('width', progressBarWidth )
            .attr('height', canvasHeight)
            .attr('rx', borderRadius)
            .attr('fill', '#f0f0f0');

          d3.select(this)
            .append('rect')
            .attr('x', 5)
            .attr('y', 45 + j * 35)
            .attr('width', progressBarWidth * (progress / 100))
            .attr('height', canvasHeight)
            .attr('rx', borderRadius)
            .attr('fill', color);
        }

        svg.selectAll('.week-text')
        .data(Array.from({ length: weekCount }, (_, i) => i))
        .enter()
        .append('text')
        .attr('class', 'week-text')
        .attr('x', (d, i) => `${i * cellWidth + cellWidth / 2}`)
        .attr('y', 20)
        .text((d, i) => `Week ${i + 1}`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', '#333');

      });
  };

  const handleNextMonth = () => {
    setMonth(month + 1);
  };

  const handlePrevMonth = () => {
    setMonth(month - 1);
  };

  React.useEffect(() => {
    drawCalendar();
  }, [month]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{d3.timeFormat('%B %Y')(new Date(2022, month))}</h2>
      </div>
      <div className="week-grid-calendar">
        <div className="calendar-container" ref={svgRef}></div>
        <div className="buttons">
          <button onClick={handlePrevMonth}>Previous Month</button>
          <button onClick={handleNextMonth}>Next Month</button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;