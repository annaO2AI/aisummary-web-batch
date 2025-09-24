import { Bold } from 'lucide-react';
import React from 'react';

const AnomalyChart = ({ agent }: { agent: { total_calls: number; total_anomalies: number } }) => {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const percentage = agent.total_anomalies / agent.total_calls;
  const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;

  return (
    <svg width="380" height="380">
         <defs>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="5" stdDeviation="10" floodColor="rgba(145, 15, 15, 0.27)" />
        </filter>
      </defs>
      <circle
        cx="190"
        cy="190"
        r={radius}
        fill="none"
        stroke="#EAEDF1"
        strokeWidth="20"
      />
      <circle
        cx="190"
        cy="190"
        r={radius}
        fill="none"
        stroke="#D43100"
        strokeWidth="20"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={circumference / 2}
        transform="rotate(-90 190 190)"
        strokeLinecap="round"
        filter="url(#dropShadow)" 
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.3em" fill="#007bff" fontSize="50" fontWeight="bold">
        {agent.total_anomalies}
      </text>
      <text x="50%" y="60%" textAnchor="middle" dy="0.3em" fill="#757575" fontSize="14">
        Total Anomalies
      </text>
    </svg>
  );
};

export default AnomalyChart;