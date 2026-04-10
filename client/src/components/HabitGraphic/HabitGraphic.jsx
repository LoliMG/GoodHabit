import React from 'react';
import './HabitGraphic.css';

const HabitGraphic = () => {
  // Generate random data points for a simple line chart
  const points = [10, 40, 25, 60, 45, 80, 70];
  const max = 100;
  
  // Create path for SVG
  const pathData = points.reduce((acc, val, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return acc + `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
  }, '');

  return (
    <div className="habit-graphic">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={pathData + ` V 100 H 0 Z`}
          fill="url(#gradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="graphic-days">
        <span>Mon</span>
        <span>Sun</span>
      </div>
    </div>
  );
};

export default HabitGraphic;
