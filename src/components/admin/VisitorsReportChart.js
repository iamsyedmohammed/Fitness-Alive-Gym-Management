import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './DashboardCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisitorsReportChart = ({ visitorsData = [], currentMonthName }) => {
  // Get current month name or use default
  const monthName = currentMonthName || new Date().toLocaleString('default', { month: 'long' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  // Process visitors data - group by date (already filtered to current month in AdminDashboard)
  const processedData = visitorsData.reduce((acc, visit) => {
    const date = new Date(visit.date || visit.created_at).getDate();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(processedData).sort((a, b) => parseInt(a) - parseInt(b));
  const data = labels.map(label => processedData[label]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Visitors',
        data: data,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `${capitalizedMonthName} Visitors Report`,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          bottom: 10
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          padding: 5
        },
        grid: {
          drawBorder: false
        }
      },
      x: {
        ticks: {
          padding: 5
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VisitorsReportChart;

