import React from 'react';
import './DashboardSections.css';

const FinancialMetricsRow = ({ metrics = {} }) => {
  const {
    totalDiscount = 0,
    totalRevenue = 0,
    totalCost = 0,
    totalDue = 0
  } = metrics;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="financial-metrics-row">
      <div className="financial-metric-row-item">
        <div className="metric-label-row">TOTAL DISCOUNT</div>
        <div className="metric-value-row discount">{formatCurrency(totalDiscount)}</div>
      </div>
      <div className="financial-metric-row-item">
        <div className="metric-label-row">TOTAL REVENUE</div>
        <div className="metric-value-row revenue">{formatCurrency(totalRevenue)}</div>
      </div>
      <div className="financial-metric-row-item">
        <div className="metric-label-row">TOTAL COST</div>
        <div className="metric-value-row cost">{formatCurrency(totalCost)}</div>
      </div>
      <div className="financial-metric-row-item">
        <div className="metric-label-row">TOTAL DUE</div>
        <div className="metric-value-row due">{formatCurrency(totalDue)}</div>
      </div>
    </div>
  );
};

export default FinancialMetricsRow;

