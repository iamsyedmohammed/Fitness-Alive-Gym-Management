import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './DashboardCharts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ShiftDistributionChart = ({ morningCount = 0, eveningCount = 0 }) => {
  const data = {
    labels: ['MORNING', 'EVENING'],
    datasets: [
      {
        data: [morningCount, eveningCount],
        backgroundColor: ['#FF9800', '#E91E63'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 11,
            weight: 'bold'
          },
          boxWidth: 12,
          boxHeight: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} Member(s) (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container doughnut-chart">
      <div className="chart-header">
        <h3>Shift Distribution</h3>
      </div>
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default ShiftDistributionChart;

