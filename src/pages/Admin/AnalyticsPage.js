import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './AnalyticsPage.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getAnalytics.php`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics || {});
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Revenue Chart Data (Last 30 Days) - Aggregated by Week
  const revenueChartData = (() => {
    const revenueData = analytics.revenueChartData || [];
    const weeks = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0
    };
    
    revenueData.forEach((item, index) => {
      const weekNum = Math.floor(index / 7) + 1;
      const weekKey = `Week ${weekNum}`;
      if (weeks.hasOwnProperty(weekKey)) {
        weeks[weekKey] += item.revenue || 0;
      }
    });

    return {
      labels: Object.keys(weeks),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: Object.values(weeks),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  })();

  // Member Growth Chart Data (Last 30 Days) - Aggregated by Week
  const memberGrowthChartData = (() => {
    const memberData = analytics.memberGrowthChartData || [];
    const weeks = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0
    };
    
    memberData.forEach((item, index) => {
      const weekNum = Math.floor(index / 7) + 1;
      const weekKey = `Week ${weekNum}`;
      if (weeks.hasOwnProperty(weekKey)) {
        weeks[weekKey] += item.count || 0;
      }
    });

    return {
      labels: Object.keys(weeks),
      datasets: [
        {
          label: 'New Members',
          data: Object.values(weeks),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  })();

  // Attendance Chart Data (Last 7 Days) - By Day of Week
  const attendanceChartData = (() => {
    const attendanceData = analytics.attendanceChartData || [];
    const dayLabels = attendanceData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    const dayValues = attendanceData.map(item => item.count || 0);

    return {
      labels: dayLabels,
      datasets: [
        {
          label: 'Attendance',
          data: dayValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  })();

  // Membership Distribution Chart
  const membershipDistributionData = {
    labels: analytics.membershipDistribution?.map(item => item.type) || [],
    datasets: [
      {
        label: 'Members',
        data: analytics.membershipDistribution?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Payment Method Distribution
  const paymentMethodData = {
    labels: analytics.paymentMethodData?.map(item => item.method.toUpperCase()) || [],
    datasets: [
      {
        label: 'Payments',
        data: analytics.paymentMethodData?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Training Type Distribution
  const trainingTypeData = {
    labels: analytics.trainingTypeData?.map(item => item.type) || [],
    datasets: [
      {
        label: 'Members',
        data: analytics.trainingTypeData?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <AdminHeader />
        <div className="admin-content">
          <div className="loading">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Analytics & Reports</h1>
        </div>

        {/* Summary Cards */}
        <div className="analytics-summary">
          <div className="summary-card">
            <div className="summary-label">Today's Revenue</div>
            <div className="summary-value">₹{analytics.todayRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">This Week</div>
            <div className="summary-value">₹{analytics.weekRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">This Month</div>
            <div className="summary-value">₹{analytics.monthRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Members</div>
            <div className="summary-value">{analytics.totalMembers || 0}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">New This Month</div>
            <div className="summary-value">{analytics.newMembersThisMonth || 0}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Today's Attendance</div>
            <div className="summary-value">{analytics.todayAttendance || 0}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="analytics-charts">
          {/* Revenue Chart */}
          <div className="chart-card">
            <h2>Revenue Distribution (Last 30 Days)</h2>
            <div className="chart-container">
              <Pie data={revenueChartData} options={pieOptions} />
            </div>
          </div>

          {/* Member Growth Chart */}
          <div className="chart-card">
            <h2>Member Growth (Last 30 Days)</h2>
            <div className="chart-container">
              <Pie data={memberGrowthChartData} options={pieOptions} />
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="chart-card">
            <h2>Daily Attendance (Last 7 Days)</h2>
            <div className="chart-container">
              <Pie data={attendanceChartData} options={pieOptions} />
            </div>
          </div>

          {/* Membership Distribution */}
          <div className="chart-card">
            <h2>Membership Type Distribution</h2>
            <div className="chart-container">
              <Pie data={membershipDistributionData} options={pieOptions} />
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="chart-card">
            <h2>Payment Methods</h2>
            <div className="chart-container">
              <Pie data={paymentMethodData} options={pieOptions} />
            </div>
          </div>

          {/* Training Type Distribution */}
          <div className="chart-card">
            <h2>Training Type Distribution</h2>
            <div className="chart-container">
              <Pie data={trainingTypeData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Membership Status Cards */}
        <div className="membership-status">
          <div className="status-card active">
            <div className="status-label">Active Memberships</div>
            <div className="status-value">{analytics.activeMemberships || 0}</div>
          </div>
          <div className="status-card expiring">
            <div className="status-label">Expiring Soon</div>
            <div className="status-value">{analytics.expiringSoon || 0}</div>
          </div>
          <div className="status-card expired">
            <div className="status-label">Expired</div>
            <div className="status-value">{analytics.expiredMemberships || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
