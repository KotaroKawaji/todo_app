// src/Calendar.js
import React from 'react';
import './Calendar.css';

const Calendar = ({ today, selectedDate, setSelectedDate }) => {
  // 現在の日時変数を宣言
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  // 月の日数を計算
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // 月初の日の曜日を計算
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // カレンダーの日付を格納する配列
  const dates = [];
  // 月初の日の曜日に対応するまでnullを追加
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(null);
  }
  // 月の日数分の日付を追加
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  // 日付がクリックされた時の処理
  const handleDateClick = (date) => {
    setSelectedDate(`${currentYear}-${currentMonth + 1}-${date}`);
  };

  return (
    
    <div className="calendar">
      <div className="calendar-header">
        {today.toLocaleString('default', { month: 'long' })} {currentYear}
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-day">{day}</div>
        ))}
        {dates.map((date, index) => (
          <div
            key={index}
            className={`calendar-date ${date ? 'active' : ''} ${selectedDate === `${currentYear}-${currentMonth + 1}-${date}` ? 'selected' : ''}`}
            onClick={() => date && handleDateClick(date)}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
