import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSort, faSortUp, faSortDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './MembersTablePage.css';

const AttendancePage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/getAllMembers.php`);
      const data = await response.json();
      if (data.success) {
        // Filter only active members
        const activeMembers = (data.members || []).filter(member => member.status === 'active');
        setMembers(activeMembers);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisit = async (memberId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/recordAttendance.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: memberId,
          date: today,
          check_in_time: new Date().toISOString(),
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return '-';
    }
  };

  const calculateDueDate = (endDate) => {
    if (!endDate) return '-';
    try {
      const date = new Date(endDate);
      if (isNaN(date.getTime())) return '-';
      date.setDate(date.getDate() + 1);
      return formatDate(date.toISOString());
    } catch (error) {
      return '-';
    }
  };

  // Filter members by search term
  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm) ||
      member.member_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membership_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id?.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (sortColumn === 'id') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    } else if (sortColumn === 'end_date') {
      aVal = new Date(aVal || 0);
      bVal = new Date(bVal || 0);
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMembers.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedMembers = sortedMembers.slice(startIndex, endIndex);

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
          <Link to="/admin/attendance/members">Attendance</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">Visits</span>
        </div>

        {/* Header with Tabs */}
        <div className="attendance-header">
          <div className="attendance-tabs">
            <span className="attendance-tab active">Members Attendance</span>
          </div>
        </div>

        {/* List of Members Section */}
        <div className="active-members-list">
          <div className="list-header">
            <h3>List of Members</h3>
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
                          Id {getSortIcon('id')}
                        </th>
                        <th onClick={() => handleSort('name')} className="sortable">
                          Name {getSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('phone')} className="sortable">
                          Phone No {getSortIcon('phone')}
                        </th>
                        <th onClick={() => handleSort('membership_type')} className="sortable">
                          Plan {getSortIcon('membership_type')}
                        </th>
                        <th onClick={() => handleSort('end_date')} className="sortable">
                          Due Date {getSortIcon('end_date')}
                        </th>
                        <th onClick={() => handleSort('status')} className="sortable">
                          Status {getSortIcon('status')}
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMembers.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                            No members found
                          </td>
                        </tr>
                      ) : (
                        paginatedMembers.map((member) => (
                          <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>{member.name || '-'}</td>
                            <td>{member.phone || '-'}</td>
                            <td>{member.membership_type || '-'}</td>
                            <td>{calculateDueDate(member.end_date)}</td>
                            <td>
                              <span className={`status-badge status-${member.status?.toLowerCase()}`}>
                                {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : '-'}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleVisit(member.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedMembers.length)} of {sortedMembers.length} entries
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

export default AttendancePage;
