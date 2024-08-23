// 一月每一日

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../Calendar.css';

export const DailyCalendar = () => {
  const svgRef = useRef();
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState(1);
  const [taskListData, setTaskListData] = useState({});


  useEffect(() => {
    const today = new Date();
    setYear(today.getFullYear())
    setMonth(today.getMonth() + 1)

    // need a get calendar data api
    // const calendarData = await getDailyCalendarData()
    const calendarData = {
      1: [{
        name: 'hello',
        task_type_color: 'red',
        progress: 20
      }, {
        name: 'world',
        task_type_color: 'green',
        progress: 20
      }, {
        name: 'yes',
        task_type_color: 'black',
        progress: 20
      }, {
        name: 'maymay',
        task_type_color: 'blue',
        progress: 20
      }],
      2: [{
        name: 'hello',
        task_type_color: 'red',
        progress: 20
      }, {
        name: 'world',
        task_type_color: 'green',
        progress: 20
      }, {
        name: 'yes',
        task_type_color: 'black',
        progress: 20
      }, {
        name: 'maymay',
        task_type_color: 'blue',
        progress: 20
      }],
      3: [{
        name: 'hello',
        task_type_color: 'red',
        progress: 20
      }, {
        name: 'maymay',
        task_type_color: 'blue',
        progress: 22
      }],
    }
    setTaskListData(calendarData)
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // 绘制日历
    const drawCalendar = () => {
      // 清空svg
      svg.selectAll('*').remove();

      // 绘制一个矩形作为日历的背景
      svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', '#f9f9f9');

      // 添加年份和月份标题
      svg.append('text')
        .attr('x', '50%')
        .attr('y', 30)
        .text(`${year} - ${month}`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '20px')
        .attr('fill', '#333')
        .style('font-weight', 'bold');

      // 绘制星期几文本
      const svgWidth = svgRef.current.clientWidth * 0.1428;
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const cellWidth = svgWidth; 
      const cellHeight = 95;

      svg.selectAll('.day-of-week')
        .data(daysOfWeek)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * cellWidth + cellWidth / 2)
        .attr('y', 60)
        .text(d => d)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#333');

      // 绘制日期方块
      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDay = new Date(year, month - 1, 1).getDay();

      for (let i = 0; i < daysInMonth; i++) { 
        const day = i + 1;
        const dayOfWeek = (firstDay + i) % 7;
        const x = dayOfWeek * cellWidth;
        const y = Math.floor((firstDay + i) / 7) * cellHeight + 90;

        // 绘制日期方块
        svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('fill', '#fff')
          .attr('stroke', '#ccc')
          .attr('rx', 5)
          .attr('ry', 5);

        // 添加日期文本
        svg.append('text')
          .attr('x', x + 5) // 在方块左侧留出一些空间
          .attr('y', y + 5) // 在方块顶部留出一些空间
          .text(day)
          .attr('text-anchor', 'start') // 文本从左侧对齐
          .attr('alignment-baseline', 'hanging') // 文本从顶部对齐
          .attr('font-size', '14px')
          .attr('fill', '#333');

        // 日期方格的左上角坐标（x，y）
        const barWidth = 10; // 进度条的宽度


        if (taskListData[day]) {
          // 循环创建6个进度条
          for (let i = 0; i < taskListData[day].length; i++) {
            const taskObj = taskListData[day][i];
            const barHeight = 8;
            const borderRadius = barHeight / 2; // 圆角半径

            // 添加日期文本
            svg.append('text')
              .attr('x', x + 15) // 在方块左侧留出一些空间
              .attr('y', y + i * 10 + 33) // 在方块顶部留出一些空间
              .text(taskObj.name + " - " + taskObj.progress)
              .attr('font-size', '10px')

            // 创建进度条的前景，表示进度
            svg.append('rect')
              .attr('x', x + 5)
              .attr('y', y + i * 10 + 25)
              .attr('width', barWidth * (80 / 100))
              .attr('height', barHeight)
              .attr('rx', borderRadius) // 设置圆角半径
              .attr('fill', taskObj.task_type_color); // 使用不同的颜色表示进度
          }
        }
      }
    };

    drawCalendar();

  }, [year, month]);

  const handleNextMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
    // api call
    setTaskListData([])
  };

  const handlePrevMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
    // api call
    setTaskListData([])
  };

  return (
    <div style={{textAlign: 'center'}}>
      <svg ref={svgRef} width={'90%'} height={600} style={{marginTop: '20px', border: '1px solid #ccc', borderRadius: '5px'}}></svg>
      <button onClick={handleNextMonth}>Previous Month</button>
      <button onClick={handlePrevMonth}>Next Month</button>
    </div>
  );

};

export default DailyCalendar;
