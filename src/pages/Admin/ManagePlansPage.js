import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const ManagePlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [planForm, setPlanForm] = useState({
    plan_name: '',
    billing_amount: '',
    fee: '',
    initial_fee: '',
    years: '',
    months: '',
    days: '',
  });
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getPlans.php`);
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanForm({
      ...planForm,
      [name]: value,
    });
  };

  const handleAddPlan = async () => {
    if (!planForm.plan_name || !planForm.billing_amount) {
      alert('Please fill in Plan Name and Billing Amount');
      return;
    }

    try {
      const url = editingPlan 
        ? `${API_BASE_URL}/updatePlan.php`
        : `${API_BASE_URL}/addPlan.php`;
      
      // If fee is empty, use billing_amount
      const planData = {
        ...planForm,
        fee: planForm.fee || planForm.billing_amount,
        id: editingPlan?.id,
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      const data = await response.json();
      if (data.success) {
        alert(editingPlan ? 'Plan updated successfully!' : 'Plan added successfully!');
        setPlanForm({
          plan_name: '',
          billing_amount: '',
          fee: '',
          initial_fee: '',
          years: '',
          months: '',
          days: '',
        });
        setEditingPlan(null);
        fetchPlans();
      } else {
        alert(data.error || 'Failed to save plan');
      }
    } catch (err) {
      alert('Error saving plan');
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      plan_name: plan.plan_name || '',
      billing_amount: plan.billing_amount || '',
      fee: plan.fee || '',
      initial_fee: plan.initial_fee || '',
      years: plan.years || '',
      months: plan.months || '',
      days: plan.days || '',
    });
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/deletePlan.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Plan deleted successfully!');
        fetchPlans();
      } else {
        alert(data.error || 'Failed to delete plan');
      }
    } catch (err) {
      alert('Error deleting plan');
    }
  };

  const handleAddDefaultPlans = async () => {
    if (!window.confirm('This will add default plans to the database. Continue?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/addDefaultPlans.php`, {
        method: 'GET',
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message || `Plans added successfully! Added: ${data.added}, Skipped: ${data.skipped}`);
        fetchPlans();
      } else {
        alert(data.error || 'Failed to add default plans');
      }
    } catch (err) {
      alert('Error adding default plans');
    }
  };

  // Filter and paginate plans
  const filteredPlans = plans.filter(plan =>
    plan.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlans.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + entriesPerPage);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Manage Plans</h1>
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Add Unlimited Plans</h2>
            <button 
              onClick={handleAddDefaultPlans} 
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Add Default Plans
            </button>
          </div>
          <div className="plans-form-row">
            <input
              type="text"
              name="plan_name"
              placeholder="Plan Name"
              value={planForm.plan_name}
              onChange={handlePlanChange}
              className="plan-input"
            />
            <input
              type="number"
              name="billing_amount"
              placeholder="Billing Amount"
              value={planForm.billing_amount}
              onChange={handlePlanChange}
              className="plan-input"
              step="0.01"
            />
            <input
              type="number"
              name="fee"
              placeholder="Fee"
              value={planForm.fee}
              onChange={handlePlanChange}
              className="plan-input"
              step="0.01"
            />
            <input
              type="number"
              name="initial_fee"
              placeholder="Initial Fee"
              value={planForm.initial_fee}
              onChange={handlePlanChange}
              className="plan-input"
              step="0.01"
            />
            <input
              type="number"
              name="years"
              placeholder="Year(s)"
              value={planForm.years}
              onChange={handlePlanChange}
              className="plan-input"
            />
            <input
              type="number"
              name="months"
              placeholder="Month(s)"
              value={planForm.months}
              onChange={handlePlanChange}
              className="plan-input"
            />
            <input
              type="number"
              name="days"
              placeholder="Day(s)"
              value={planForm.days}
              onChange={handlePlanChange}
              className="plan-input"
            />
            <button 
              onClick={handleAddPlan} 
              className="btn-primary plan-add-btn"
            >
              {editingPlan ? 'Update' : 'Add'}
            </button>
          </div>
        </div>

        <div className="section-card">
          <h2>List of Plans</h2>
          <div className="plans-table-controls">
            <div className="entries-control">
              <span>Show</span>
              <select 
                value={entriesPerPage} 
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
            <div className="search-control">
              <label>Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search plans..."
              />
            </div>
          </div>

          <div className="plans-table-wrapper">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Billing Amount</th>
                  <th>Fee</th>
                  <th>Initial Fee</th>
                  <th>Year(s)</th>
                  <th>Month(s)</th>
                  <th>Day(s)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlans.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                      No plans found
                    </td>
                  </tr>
                ) : (
                  paginatedPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.plan_name}</td>
                      <td>₹{parseFloat(plan.billing_amount || 0).toFixed(2)}</td>
                      <td>₹{parseFloat(plan.fee || plan.billing_amount || 0).toFixed(2)}</td>
                      <td>₹{parseFloat(plan.initial_fee || 0).toFixed(2)}</td>
                      <td>{plan.years || 0}</td>
                      <td>{plan.months || 0}</td>
                      <td>{plan.days || 0}</td>
                      <td>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="plans-pagination">
            <div className="pagination-info">
              Showing {filteredPlans.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredPlans.length)} of {filteredPlans.length} entries
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePlansPage;

