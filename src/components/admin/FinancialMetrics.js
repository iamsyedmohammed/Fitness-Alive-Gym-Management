import React from 'react';
import './DashboardSections.css';

const FinancialMetrics = ({ metrics = {} }) => {
  const {
    totalDue = 0
  } = metrics;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="financial-metric-single-container">
      <div className="financial-metric-single-item">
        <div className="metric-label-single">TOTAL DUE</div>
        <div className="metric-value-single due">{formatCurrency(totalDue)}</div>
      </div>
    </div>
  );
};

export default FinancialMetrics;
