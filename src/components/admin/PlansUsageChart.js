import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './DashboardCharts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlansUsageChart = ({ members = [] }) => {
  // Calculate plan usage from members
  const planCounts = {};
  
  members.forEach(member => {
    const planType = member.membership_type || member.plan_type || 'Unknown';
    planCounts[planType] = (planCounts[planType] || 0) + 1;
  });

  // Sort plans by count (descending) and get top plans
  const sortedPlans = Object.entries(planCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([plan, count]) => plan && plan !== 'Unknown' && plan !== '');

  // Prepare data for chart
  const labels = sortedPlans.map(([plan]) => plan);
  const data = sortedPlans.map(([, count]) => count);

  // Generate colors for the pie chart
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
    '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 10,
          font: {
            size: 10,
            weight: 'bold'
          },
          boxWidth: 12,
          boxHeight: 12,
          maxWidth: 150,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                // Truncate long labels
                const truncatedLabel = label.length > 20 ? label.substring(0, 20) + '...' : label;
                return {
                  text: `${truncatedLabel} (${value})`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                  fontColor: '#000',
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Plans Usage',
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          bottom: 10
        }
      }
    }
  };

  return (
    <div className="chart-container doughnut-chart">
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PlansUsageChart;

