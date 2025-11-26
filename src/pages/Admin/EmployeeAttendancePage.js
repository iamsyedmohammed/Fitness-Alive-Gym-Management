import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSort, faSortUp, faSortDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './MembersTablePage.css';

const EmployeeAttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        // Filter only active employees (assuming status field exists, or show all if not)
        const activeEmployees = (data.trainers || []).filter(employee => 
          !employee.status || employee.status === 'active'
        );
        setEmployees(activeEmployees);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisit = async (employeeId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/recordAttendance.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          date: today,
          check_in_time: new Date().toISOString(),
          type: 'employee',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Visit recorded successfully!');
      } else {
        alert(data.error || 'Failed to record visit');
      }
    } catch (err) {
      alert('Error recording visit');
      console.error('Error:', err);
    }
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone?.includes(searchTerm) ||
      employee.id?.toString().includes(searchTerm) ||
      employee.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (sortColumn === 'id') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <FontAwesomeIcon icon={faSort} className="sort-icon" />;
    }
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="sort-icon active" />
      : <FontAwesomeIcon icon={faSortDown} className="sort-icon active" />;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        {/* Breadcrumb */}
        <div className="members-table-breadcrumb">
          <Link to="/admin">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/admin/attendance/employees">Employees</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">Attendance</span>
        </div>

        {/* Header with Tabs (no search bar) */}
        <div className="attendance-header">
          <div className="attendance-tabs">
            <span className="attendance-tab active">Employee Attendance</span>
          </div>
        </div>

        {/* List of Employee(s) Section */}
        <div className="active-members-list">
          <div className="list-header">
            <h3>List of Employee(s)</h3>
          </div>

          {/* Controls */}
          <div className="members-table-controls">
            <div className="entries-control">
              <label>Show</label>
              <select 
                value={entriesPerPage} 
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="entries-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label>entries</label>
            </div>
            <div className="search-control">
              <label>Search:</label>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="members-table-search"
                  placeholder=""
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="search-clear-btn"
                    aria-label="Clear search"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="members-table-wrapper">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <div className="members-table-container">
                  <table className="members-table active-members-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('id')} className="sortable">
                          Employee Id {getSortIcon('id')}
                        </th>
                        <th onClick={() => handleSort('name')} className="sortable">
                          Name {getSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('phone')} className="sortable">
                          Phone No {getSortIcon('phone')}
                        </th>
                        <th onClick={() => handleSort('address')} className="sortable">
                          Address {getSortIcon('address')}
                        </th>
                        <th onClick={() => handleSort('id')} className="sortable">
                          Action {getSortIcon('id')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                            No employees found
                          </td>
                        </tr>
                      ) : (
                        paginatedEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name || '-'}</td>
                            <td>{employee.phone || '-'}</td>
                            <td>{employee.address || '-'}</td>
                            <td>
                              <button
                                onClick={() => handleVisit(employee.id)}
                                className="visit-btn"
                              >
                                Visit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="members-table-pagination">
                  <div className="pagination-info">
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedEmployees.length)} of {sortedEmployees.length} entries
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;
