import React from 'react';
import './DashboardSections.css';

const SalesComparison = ({ monthlySales = [] }) => {
  // Use the provided monthlySales data (which should contain last 4 months)
  // If not enough data, generate months dynamically based on current date
  let salesData = monthlySales;
  
  if (salesData.length < 4) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = [];
    
    // Generate last 4 months dynamically
    for (let i = 3; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'long' });
      months.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        amount: salesData[i]?.amount || 0
      });
    }
    salesData = months;
  }

  return (
    <div className="sales-comparison-container-new">
      <h3>SALES COMPARISON LAST 4 MONTHS</h3>
      <div className="sales-comparison-list-new">
        {salesData.map((sale, index) => {
          const month = sale.month;
          const amount = sale.amount || 0;
          // The last item in the array is always the current month (since we generate last 4 months)
          const isCurrentMonth = index === salesData.length - 1;
          
          return (
            <div key={index} className="sales-comparison-item-new">
              <div className="sales-month-new">{month} Sales</div>
              <input 
                type="text" 
                className={`sales-input-field ${isCurrentMonth ? 'current-month' : ''}`}
                value={amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                readOnly
              />
              <div className="sales-amount-new">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesComparison;
