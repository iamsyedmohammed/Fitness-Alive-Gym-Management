import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDumbbell, faCheckCircle, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatisticsCards from '../../components/admin/StatisticsCards';
import ShiftDistributionSection from '../../components/admin/ShiftDistributionSection';
import ShiftDistributionChart from '../../components/admin/ShiftDistributionChart';
import VisitorsReportChart from '../../components/admin/VisitorsReportChart';
import RecentVisitsSection from '../../components/admin/RecentVisitsSection';
import NewMembersSection from '../../components/admin/NewMembersSection';
import MonthlyRecapChart from '../../components/admin/MonthlyRecapChart';
import SalesComparison from '../../components/admin/SalesComparison';
import FinancialMetricsRow from '../../components/admin/FinancialMetricsRow';
import PlansUsageChart from '../../components/admin/PlansUsageChart';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentVisits, setRecentVisits] = useState([]);
  const [newMembers, setNewMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [visitorsData, setVisitorsData] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [financialMetrics, setFinancialMetrics] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current date information (used throughout the function)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/getDashboardStats.php`);
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch members for shift distribution and new members
      const membersResponse = await fetch(`${API_BASE_URL}/getMembers.php`);
      const membersData = await membersResponse.json();
      let members = [];
      
      if (membersData.success) {
        members = membersData.members || [];
        setAllMembers(members); // Store all members for Plans Usage chart
        
        // Calculate shift distribution
        const morningCount = members.filter(m => m.shift === 'Morning' || m.shift === 'morning').length;
        const eveningCount = members.filter(m => m.shift === 'Evening' || m.shift === 'evening').length;
        
        // Get new members for current month (sorted by start_date, most recent first)
        const currentMonthMembers = members.filter(member => {
          const memberDate = new Date(member.start_date || member.created_at);
          return memberDate.getMonth() === currentMonth &&
                 memberDate.getFullYear() === currentYear;
        });
        
        const sortedNewMembers = [...currentMonthMembers]
          .sort((a, b) => new Date(b.start_date || b.created_at) - new Date(a.start_date || a.created_at))
          .slice(0, 8);
        setNewMembers(sortedNewMembers);
        
        // Update stats with shift counts
        setStats(prev => ({
          ...prev,
          morningCount,
          eveningCount,
          malesCount: members.length // Assuming all members are males for now, or add gender field
        }));
      }

      // Store members for later use in financial metrics
      const allMembers = members;

        // Fetch attendance for recent visits
      const attendanceResponse = await fetch(`${API_BASE_URL}/getAttendance.php`);
      const attendanceData = await attendanceResponse.json();
      if (attendanceData.success) {
        const attendance = attendanceData.attendance || [];
        
        // Filter attendance for current month
        const currentMonthAttendance = attendance.filter(visit => {
          const visitDate = new Date(visit.visit_date || visit.created_at);
          return visitDate.getMonth() === currentMonth &&
                 visitDate.getFullYear() === currentYear;
        });
        
        // Join attendance with member data
        const visitsWithMemberData = attendance.map(visit => {
          const member = members.find(m => m.id === visit.member_id);
          return {
            ...visit,
            name: member?.name || 'Unknown',
            image_url: member?.image_url || null
          };
        });
        
        // Filter recent visits for current month, then sort by most recent first
        const currentMonthVisits = visitsWithMemberData.filter(visit => {
          const visitDate = new Date(visit.visit_date || visit.created_at);
          return visitDate.getMonth() === currentMonth &&
                 visitDate.getFullYear() === currentYear;
        });
        
        const sortedVisits = [...currentMonthVisits]
          .sort((a, b) => new Date(b.visit_date || b.created_at) - new Date(a.visit_date || a.created_at))
          .slice(0, 8);
        setRecentVisits(sortedVisits);
        setVisitorsData(currentMonthAttendance); // Use current month attendance for visitors chart
      }

      // Fetch payments for monthly recap and financial metrics
      const paymentsResponse = await fetch(`${API_BASE_URL}/getPayments.php`);
      const paymentsData = await paymentsResponse.json();
      if (paymentsData.success) {
        const payments = paymentsData.payments || [];

        // Helper function to parse date safely
        const parsePaymentDate = (payment) => {
          const dateStr = payment.payment_date || payment.created_at;
          if (!dateStr) return null;
          
          // Handle different date formats
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return null;
          return date;
        };
        
        // Calculate daily revenue for current month (all days in the month)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dailyRevenueData = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dayDate = new Date(currentYear, currentMonth, day);
          const dayPayments = payments.filter(p => {
            const paymentDate = parsePaymentDate(p);
            if (!paymentDate) return false;
            
            const status = (p.status || '').toLowerCase();
            return paymentDate.getDate() === day && 
                   paymentDate.getMonth() === currentMonth &&
                   paymentDate.getFullYear() === currentYear &&
                   status === 'completed';
          });
          const dayTotal = dayPayments.reduce((sum, p) => {
            const amount = parseFloat(p.amount || 0);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);
          dailyRevenueData.push({
            date: dayDate.toISOString().split('T')[0],
            amount: dayTotal
          });
        }
        setDailyRevenue(dailyRevenueData);
        
        // Calculate monthly sales for last 4 months
        const monthlySalesData = [];
        for (let i = 3; i >= 0; i--) {
          const monthDate = new Date(currentYear, currentMonth - i, 1);
          const monthName = monthDate.toLocaleString('default', { month: 'long' });
          const targetMonth = monthDate.getMonth();
          const targetYear = monthDate.getFullYear();
          
          const monthPayments = payments.filter(p => {
            const paymentDate = parsePaymentDate(p);
            if (!paymentDate) return false;
            
            const status = (p.status || '').toLowerCase();
            return paymentDate.getMonth() === targetMonth &&
                   paymentDate.getFullYear() === targetYear &&
                   status === 'completed';
          });
          
          const monthTotal = monthPayments.reduce((sum, p) => {
            const amount = parseFloat(p.amount || 0);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);
          
          monthlySalesData.push({
            month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            amount: monthTotal
          });
        }
        setMonthlySales(monthlySalesData);

        // Calculate Current Month Sales
        const currentMonthName = new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long' });
        const capitalizedMonthName = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
        
        const currentMonthPayments = payments.filter(p => {
          const paymentDate = parsePaymentDate(p);
          if (!paymentDate) return false;
          
          // Compare month and year
          const paymentMonth = paymentDate.getMonth();
          const paymentYear = paymentDate.getFullYear();
          
          // Check status (case insensitive)
          const status = (p.status || '').toLowerCase();
          const isCompleted = status === 'completed';
          
          return paymentMonth === currentMonth &&
                 paymentYear === currentYear &&
                 isCompleted;
        });
        
        const currentMonthSales = currentMonthPayments.reduce((sum, p) => {
          const amount = parseFloat(p.amount || 0);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        
        // Debug logging (can be removed in production)
        console.log('Current Month Sales Calculation:', {
          currentMonth,
          currentYear,
          monthName: capitalizedMonthName,
          totalPayments: payments.length,
          currentMonthPayments: currentMonthPayments.length,
          currentMonthSales,
          samplePayment: payments[0],
          allPaymentsStatus: payments.map(p => ({ status: p.status, date: p.payment_date || p.created_at }))
        });

        // Calculate financial metrics - use current month revenue
        const calculatedTotalRevenue = currentMonthSales; // Use current month revenue
        
        // Calculate discount and due from members
        const totalDiscount = allMembers.reduce((sum, m) => sum + parseFloat(m.discount || 0), 0);
        const totalDue = allMembers.reduce((sum, m) => sum + parseFloat(m.due_amount || 0), 0);
        
        // Total cost (can be calculated from expenses or set to a value)
        // For now, using a placeholder calculation
        const calculatedTotalCost = calculatedTotalRevenue * 1.005; // Example: 0.5% overhead

        setTotalRevenue(calculatedTotalRevenue);
        setTotalCost(calculatedTotalCost);
        setFinancialMetrics({
          totalDiscount,
          totalRevenue: calculatedTotalRevenue,
          totalCost: calculatedTotalCost,
          totalDue
        });
        
        // Update stats with Current Month Sales and month name
        setStats(prev => ({
          ...prev,
          currentMonthSales,
          currentMonthName: capitalizedMonthName
        }));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Dashboard</h1>
          <p>Welcome to GYM Management System</p>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <StatisticsCards stats={stats} />
            
            <ShiftDistributionSection 
              morningCount={stats.morningCount || 0}
              eveningCount={stats.eveningCount || 0}
              malesCount={stats.malesCount || stats.totalMembers || 0}
            />

            <div className="dashboard-main-container">
              <div className="dashboard-main-grid">
                <MonthlyRecapChart dailyRevenue={dailyRevenue} currentMonthName={stats.currentMonthName} />
                <SalesComparison monthlySales={monthlySales} />
                <div className="financial-metrics-row-wrapper">
                  <FinancialMetricsRow metrics={financialMetrics} />
                </div>
              </div>
            </div>

            <div className="dashboard-charts-grid">
              <ShiftDistributionChart 
                morningCount={stats.morningCount || 0}
                eveningCount={stats.eveningCount || 0}
              />
              <VisitorsReportChart visitorsData={visitorsData} currentMonthName={stats.currentMonthName} />
              <PlansUsageChart members={allMembers} />
            </div>

            <div className="dashboard-sections-grid">
              <RecentVisitsSection visits={recentVisits} currentMonthName={stats.currentMonthName} />
              <NewMembersSection members={newMembers} currentMonthName={stats.currentMonthName} />
            </div>

            <div className="section-card">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <Link to="/admin/members/add" className="action-btn">
                  <FontAwesomeIcon icon={faPlus} /> Add Member
                </Link>
                <Link to="/admin/employees/add" className="action-btn">
                  <FontAwesomeIcon icon={faDumbbell} /> Add Employee
                </Link>
                <Link to="/admin/attendance" className="action-btn">
                  <FontAwesomeIcon icon={faCheckCircle} /> Record Attendance
                </Link>
                <Link to="/admin/payments" className="action-btn">
                  <FontAwesomeIcon icon={faCreditCard} /> Record Payment
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
