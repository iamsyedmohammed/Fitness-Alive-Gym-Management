import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './DashboardCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyRecapChart = ({ dailyRevenue = [], currentMonthName }) => {
  // Get current month name or use default
  const monthName = currentMonthName || new Date().toLocaleString('default', { month: 'long' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  // Generate labels for all days in the current month
  const daysInMonth = dailyRevenue.length > 0 
    ? dailyRevenue.length 
    : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  
  // Process daily revenue data
  const data = labels.map(day => {
    const dayData = dailyRevenue.find(d => new Date(d.date).getDate() === parseInt(day));
    return dayData ? dayData.amount : 0;
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Revenue',
        data: data,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#2196F3',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#FFFFFF',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 25
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `${capitalizedMonthName} Recap Report`,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          bottom: 15,
          top: 5
        }
      },
      tooltip: {
        backgroundColor: '#333333',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#333333',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return '';
          },
          label: function(context) {
            const day = context.label;
            const value = context.parsed.y;
            // Format as "13: 6900" - just the number without currency
            return `${day}: ${Math.round(value).toLocaleString('en-IN')}`;
          }
        },
        titleFont: {
          size: 0
        },
        bodyFont: {
          size: 13,
          weight: 'bold'
        },
        cornerRadius: 4,
        caretSize: 6,
        caretPadding: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20000,
        ticks: {
          stepSize: 5000,
          callback: function(value) {
            return value.toLocaleString('en-IN');
          },
          padding: 8
        },
        grid: {
          drawBorder: false
        }
      },
      x: {
        ticks: {
          maxTicksLimit: daysInMonth,
          padding: 12,
          font: {
            size: 11
          }
        },
        grid: {
          drawBorder: false
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper" style={{ height: '320px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyRecapChart;

