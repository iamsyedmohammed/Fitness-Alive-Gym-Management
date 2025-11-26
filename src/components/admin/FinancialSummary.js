import React from 'react';
import './DashboardSections.css';

const FinancialSummary = ({ metrics = {} }) => {
  const {
    totalDiscount = 0,
    totalRevenue = 0,
    totalCost = 0
  } = metrics;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="financial-summary-container">
      <div className="financial-summary-item">
        <div className="summary-label">TOTAL DISCOUNT</div>
        <div className="summary-value discount">{formatCurrency(totalDiscount)}</div>
      </div>
      <div className="financial-summary-item">
        <div className="summary-label">TOTAL REVENUE</div>
        <div className="summary-value revenue">{formatCurrency(totalRevenue)}</div>
      </div>
      <div className="financial-summary-item">
        <div className="summary-label">TOTAL COST</div>
        <div className="summary-value cost">{formatCurrency(totalCost)}</div>
      </div>
    </div>
  );
};

export default FinancialSummary;

