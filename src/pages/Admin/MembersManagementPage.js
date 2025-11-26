import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome, faSort, faSortUp, faSortDown, faPlusCircle, faTimes, faMinus, faChevronDown, faChevronUp, faEdit, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import MemberFormModal from '../../components/admin/MemberFormModal';
import WhatsAppButton from '../../components/admin/WhatsAppButton';
import DateRangePicker from '../../components/admin/DateRangePicker';
import { exportMembersToExcel, exportMembersToPDF } from '../../utils/exportUtils';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './MembersTablePage.css';

const MembersManagementPage = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMembership, setFilterMembership] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [filterMembershipId, setFilterMembershipId] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');
  const [exporting, setExporting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');

    if (statusParam) {
      setFilterStatus(statusParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, [filterStatus]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Use getAllMembers for all statuses to get complete member data including expired/inactive
      const response = await fetch(`${API_BASE_URL}/getAllMembers.php`);
      const data = await response.json();
      if (data.success) {
        // Filter by status client-side if needed
        const fetchedMembers = data.members || [];
        setMembers(fetchedMembers);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        setTrainers(data.trainers || []);
      }
    } catch (err) {
      console.error('Error fetching trainers:', err);
    }
  };

  const handleAdd = () => {
    navigate('/admin/members/add');
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const url = editingMember
        ? `${API_BASE_URL}/updateMember.php`
        : `${API_BASE_URL}/addMember.php`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember ? { ...formData, id: editingMember.id } : formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchMembers();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Error saving member');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/deleteMember.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        fetchMembers();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert('Error deleting member');
    }
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : '-';
  };

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it starts with /, it's a relative path - make it absolute
    if (imageUrl.startsWith('/')) {
      return `https://slateblue-turkey-331136.hostingersite.com${imageUrl}`;
    }
    // Otherwise, assume it's a relative path and prepend the base URL
    return `https://slateblue-turkey-331136.hostingersite.com/${imageUrl}`;
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm) ||
      member.member_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesMembership = filterMembership === 'all' || member.membership_type === filterMembership;
    
    // Additional filters for active/inactive/expired pages
    const matchesMembershipId = !filterMembershipId || 
                                member.member_code?.toLowerCase().includes(filterMembershipId.toLowerCase()) ||
                                member.id?.toString() === filterMembershipId;
    
    const matchesDateRange = !filterDateRange || (() => {
      if (!filterDateRange.includes(' & ')) return true;
      const dates = filterDateRange.split(' & ');
      if (dates.length !== 2) return true;
      
      const parseDate = (dateStr) => {
        const parts = dateStr.trim().split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      };
      
      const startDate = parseDate(dates[0]);
      const endDate = parseDate(dates[1]);
      if (!startDate || !endDate) return true;
      
      const memberDate = new Date(member.created_at || member.start_date);
      return memberDate >= startDate && memberDate <= endDate;
    })();
    
    return matchesSearch && matchesStatus && matchesMembership && matchesMembershipId && matchesDateRange;
  });

  // Sorting function
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    
    if (sortColumn === 'id') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    } else if (sortColumn === 'created_at' || sortColumn === 'start_date' || sortColumn === 'end_date') {
      aVal = new Date(aVal || 0);
      bVal = new Date(bVal || 0);
    } else if (sortColumn === 'due_amount') {
      aVal = parseFloat(aVal || 0);
      bVal = parseFloat(bVal || 0);
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toggleRow = (memberId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
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

  const getPageTitle = () => {
    if (filterStatus === 'active') return 'Active Members';
    if (filterStatus === 'inactive') return 'Inactive Members';
    if (filterStatus === 'expired') return 'Dues / Expired Members';
    return 'All Members';
  };

  const isAllMembersPage = filterStatus === 'all' || !filterStatus;

  // Export functions
  const handleExportExcel = () => {
    setExporting(true);
    try {
      exportMembersToExcel(filteredMembers, 'members');
    } catch (error) {
      alert('Error exporting to Excel: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = () => {
    setExporting(true);
    try {
      exportMembersToPDF(filteredMembers, 'members');
    } catch (error) {
      alert('Error exporting to PDF: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        {isAllMembersPage ? (
          <>
            {/* Breadcrumb */}
            <div className="members-table-breadcrumb">
              <Link to="/admin">
                <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
                Home
              </Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <Link to="/admin/members">Members</Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <span className="breadcrumb-current">All Members</span>
            </div>

            {/* Header */}
            <div className="members-table-header">
              <div className="members-table-title-section">
                <h1 className="members-table-main-title">Members</h1>
                <span className="members-table-sub-title">All Members</span>
              </div>
            </div>

            {/* Divider */}
            <div className="members-table-divider"></div>

            {/* Page Title */}
            <h2 className="members-table-page-title">List of All Members with Complete Details</h2>

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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  onClick={handleExportExcel} 
                  className="btn-primary"
                  disabled={exporting || filteredMembers.length === 0}
                  style={{ padding: '6px 12px', fontSize: '14px' }}
                  title="Export to Excel"
                >
                  <FontAwesomeIcon icon={faFileExcel} /> Excel
                </button>
                <button 
                  onClick={handleExportPDF} 
                  className="btn-primary"
                  disabled={exporting || filteredMembers.length === 0}
                  style={{ padding: '6px 12px', fontSize: '14px' }}
                  title="Export to PDF"
                >
                  <FontAwesomeIcon icon={faFilePdf} /> PDF
                </button>
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
          </>
        ) : filterStatus === 'active' ? (
          <>
            {/* Breadcrumb */}
            <div className="members-table-breadcrumb">
              <Link to="/admin">
                <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
                Home
              </Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <Link to="/admin/members">Members</Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <span className="breadcrumb-current">Active Members</span>
            </div>

            {/* Header */}
            <div className="members-table-header">
              <div className="members-table-title-section">
                <h1 className="members-table-main-title">Members</h1>
                <span className="members-table-sub-title">Active Members</span>
              </div>
            </div>

            {/* Filters Section */}
            <div className="active-members-filters">
              <div className="filters-header">
                <h3>Filters</h3>
                <button
                  type="button"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="collapse-toggle-btn"
                >
                  <FontAwesomeIcon icon={filtersExpanded ? faChevronUp : faChevronDown} />
                </button>
              </div>
              {filtersExpanded && (
                <div className="filters-content">
                  <input
                    type="text"
                    placeholder="MembershipId"
                    value={filterMembershipId}
                    onChange={(e) => setFilterMembershipId(e.target.value)}
                    className="filter-input"
                  />
                  <DateRangePicker
                    value={filterDateRange}
                    onChange={(value) => setFilterDateRange(value)}
                    placeholder="Date Range"
                  />
                  <button className="filter-view-btn">View</button>
                </div>
              )}
            </div>

            {/* List of Active Members Section */}
            <div className="active-members-list">
              <div className="list-header">
                <h3>List of Active Members</h3>
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
                            <th onClick={() => handleSort('created_at')} className="sortable">
                              Joining Date {getSortIcon('created_at')}
                            </th>
                            <th onClick={() => handleSort('address')} className="sortable">
                              Address {getSortIcon('address')}
                            </th>
                            <th onClick={() => handleSort('training_type')} className="sortable">
                              Shift {getSortIcon('training_type')}
                            </th>
                            <th onClick={() => handleSort('phone')} className="sortable">
                              Phone {getSortIcon('phone')}
                            </th>
                            <th onClick={() => handleSort('email')} className="sortable">
                              Email {getSortIcon('email')}
                            </th>
                            <th onClick={() => handleSort('start_date')} className="sortable">
                              From {getSortIcon('start_date')}
                            </th>
                            <th onClick={() => handleSort('membership_type')} className="sortable">
                              Plan {getSortIcon('membership_type')}
                            </th>
                            <th onClick={() => handleSort('end_date')} className="sortable">
                              Due Date {getSortIcon('end_date')}
                            </th>
                            <th>Photo</th>
                            <th onClick={() => handleSort('status')} className="sortable">
                              Status {getSortIcon('status')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedMembers.length === 0 ? (
                            <tr>
                              <td colSpan="12" style={{ textAlign: 'center', padding: '40px' }}>
                                No members found
                              </td>
                            </tr>
                          ) : (
                            paginatedMembers.map((member) => (
                              <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.name || '-'}</td>
                                <td>{formatDate(member.created_at)}</td>
                                <td>{member.address || '-'}</td>
                                <td>{member.training_type || '-'}</td>
                                <td>{member.phone || '-'}</td>
                                <td title={member.email || '-'} className="email-cell">
                                  {member.email || '-'}
                                </td>
                                <td>{formatDate(member.start_date)}</td>
                                <td>{member.membership_type || '-'}</td>
                                <td>{calculateDueDate(member.end_date)}</td>
                                <td>
                                  {member.image_url ? (
                                    <img 
                                      src={getImageUrl(member.image_url)} 
                                      alt={member.name}
                                      className="member-photo"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const placeholder = e.target.parentElement.querySelector('.member-photo-placeholder');
                                        if (placeholder) {
                                          placeholder.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div className="member-photo-placeholder" style={{ display: member.image_url ? 'none' : 'flex' }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-badge status-${member.status?.toLowerCase()}`}>
                                    {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : '-'}
                                  </span>
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
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} entries
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
          </>
        ) : filterStatus === 'inactive' ? (
          <>
            {/* Breadcrumb */}
            <div className="members-table-breadcrumb">
              <Link to="/admin">
                <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
                Home
              </Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <Link to="/admin/members">Members</Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <span className="breadcrumb-current">Inactive Members</span>
            </div>

            {/* Header */}
            <div className="members-table-header">
              <div className="members-table-title-section">
                <h1 className="members-table-main-title">Members</h1>
                <span className="members-table-sub-title">Inactive Members</span>
              </div>
            </div>

            {/* Filters Section */}
            <div className="active-members-filters">
              <div className="filters-header">
                <h3>Filters</h3>
                <button
                  type="button"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="collapse-toggle-btn"
                >
                  <FontAwesomeIcon icon={filtersExpanded ? faChevronUp : faChevronDown} />
                </button>
              </div>
              {filtersExpanded && (
                <div className="filters-content">
                  <input
                    type="text"
                    placeholder="MembershipId"
                    value={filterMembershipId}
                    onChange={(e) => setFilterMembershipId(e.target.value)}
                    className="filter-input"
                  />
                  <DateRangePicker
                    value={filterDateRange}
                    onChange={(value) => setFilterDateRange(value)}
                    placeholder="Date Range"
                  />
                  <button className="filter-view-btn">View</button>
                </div>
              )}
            </div>

            {/* List of InActive Members Section */}
            <div className="active-members-list">
              <div className="list-header">
                <h3>List of InActive Members</h3>
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
                            <th onClick={() => handleSort('created_at')} className="sortable">
                              Joining Date {getSortIcon('created_at')}
                            </th>
                            <th onClick={() => handleSort('address')} className="sortable">
                              Address {getSortIcon('address')}
                            </th>
                            <th onClick={() => handleSort('training_type')} className="sortable">
                              Shift {getSortIcon('training_type')}
                            </th>
                            <th onClick={() => handleSort('phone')} className="sortable">
                              Phone {getSortIcon('phone')}
                            </th>
                            <th onClick={() => handleSort('email')} className="sortable">
                              Email {getSortIcon('email')}
                            </th>
                            <th onClick={() => handleSort('start_date')} className="sortable">
                              From {getSortIcon('start_date')}
                            </th>
                            <th onClick={() => handleSort('membership_type')} className="sortable">
                              Plan {getSortIcon('membership_type')}
                            </th>
                            <th onClick={() => handleSort('end_date')} className="sortable">
                              Due Date {getSortIcon('end_date')}
                            </th>
                            <th>Photo</th>
                            <th onClick={() => handleSort('status')} className="sortable">
                              Status {getSortIcon('status')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedMembers.length === 0 ? (
                            <tr>
                              <td colSpan="12" style={{ textAlign: 'center', padding: '40px' }}>
                                No members found
                              </td>
                            </tr>
                          ) : (
                            paginatedMembers.map((member) => (
                              <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.name || '-'}</td>
                                <td>{formatDate(member.created_at)}</td>
                                <td>{member.address || '-'}</td>
                                <td>{member.training_type || '-'}</td>
                                <td>{member.phone || '-'}</td>
                                <td title={member.email || '-'} className="email-cell">
                                  {member.email || '-'}
                                </td>
                                <td>{formatDate(member.start_date)}</td>
                                <td>{member.membership_type || '-'}</td>
                                <td>{calculateDueDate(member.end_date)}</td>
                                <td>
                                  {member.image_url ? (
                                    <img 
                                      src={getImageUrl(member.image_url)} 
                                      alt={member.name}
                                      className="member-photo"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const placeholder = e.target.parentElement.querySelector('.member-photo-placeholder');
                                        if (placeholder) {
                                          placeholder.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div className="member-photo-placeholder" style={{ display: member.image_url ? 'none' : 'flex' }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-badge status-${member.status?.toLowerCase()}`}>
                                    {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : '-'}
                                  </span>
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
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} entries
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
          </>
        ) : (
          <>
            {filterStatus !== 'expired' && (
              <>
                <div className="content-header">
                  <h1>{getPageTitle()}</h1>
                </div>
                <div className="search-filter-bar">
                  <input
                    type="text"
                    placeholder="Search by code, name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                  <select value={filterMembership} onChange={(e) => setFilterMembership(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half Yearly">Half Yearly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </>
            )}

            {!isAllMembersPage && filterStatus !== 'active' && filterStatus !== 'inactive' && filterStatus !== 'expired' && (
              <div className="data-table">
                <div className="table-header">
                  <h2>{getPageTitle()} ({filteredMembers.length})</h2>
                  <div className="table-actions">
                    <button onClick={handleAdd} className="btn-primary">
                      <FontAwesomeIcon icon={faPlus} /> Add New Member
                    </button>
                  </div>
                </div>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Training Type</th>
                          <th>Membership</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>End Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                              No members found
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((member) => (
                            <tr key={member.id}>
                              <td>
                                {member.image_url ? (
                                  <img 
                                    src={getImageUrl(member.image_url)} 
                                    alt={member.name}
                                    className="table-member-image"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const placeholder = e.target.parentElement.querySelector('.table-member-image-placeholder');
                                      if (placeholder) {
                                        placeholder.style.display = 'flex';
                                      }
                                    }}
                                  />
                                ) : null}
                                <div className="table-member-image-placeholder" style={{ display: member.image_url ? 'none' : 'flex' }}>
                                  No Image
                                </div>
                              </td>
                              <td><strong>{member.member_code || '-'}</strong></td>
                              <td>{member.name}</td>
                              <td>{member.phone || '-'}</td>
                              <td>{member.training_type || '-'}</td>
                              <td>{member.membership_type || '-'}</td>
                              <td>{member.price ? `₹${parseFloat(member.price).toLocaleString('en-IN')}` : '-'}</td>
                              <td>
                                <span className={`status-badge status-${member.status}`}>
                                  {member.status}
                                </span>
                              </td>
                              <td>{member.end_date || '-'}</td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    onClick={() => handleEdit(member)}
                                    className="btn-small btn-edit"
                                  >
                                    Edit
                                  </button>
                                  <WhatsAppButton 
                                    phone={member.phone} 
                                    message={`Hi ${member.name}, `}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {isAllMembersPage ? (
          <div className="members-table-wrapper">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <div className="members-table-container">
                  <table className="members-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('id')} className="sortable">
                          Id {getSortIcon('id')}
                        </th>
                        <th onClick={() => handleSort('name')} className="sortable">
                          Name {getSortIcon('name')}
                        </th>
                        <th>Father</th>
                        <th onClick={() => handleSort('address')} className="sortable">
                          Address {getSortIcon('address')}
                        </th>
                        <th onClick={() => handleSort('location')} className="sortable">
                          City {getSortIcon('location')}
                        </th>
                        <th onClick={() => handleSort('phone')} className="sortable">
                          Phone No {getSortIcon('phone')}
                        </th>
                        <th onClick={() => handleSort('training_type')} className="sortable">
                          Shift {getSortIcon('training_type')}
                        </th>
                        <th onClick={() => handleSort('created_at')} className="sortable">
                          Joined {getSortIcon('created_at')}
                        </th>
                        <th>BirthDate</th>
                        <th onClick={() => handleSort('email')} className="sortable">
                          Email {getSortIcon('email')}
                        </th>
                        <th>Photo</th>
                        <th onClick={() => handleSort('start_date')} className="sortable">
                          ContractFrom {getSortIcon('start_date')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMembers.length === 0 ? (
                        <tr>
                          <td colSpan="13" style={{ textAlign: 'center', padding: '40px' }}>
                            No members found
                          </td>
                        </tr>
                      ) : (
                        paginatedMembers.map((member) => (
                          <React.Fragment key={member.id}>
                            <tr>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => toggleRow(member.id)}
                                  className="expand-toggle-btn"
                                  aria-label={expandedRows.has(member.id) ? 'Collapse' : 'Expand'}
                                >
                                  <FontAwesomeIcon 
                                    icon={expandedRows.has(member.id) ? faMinus : faPlusCircle} 
                                    className={`id-icon ${expandedRows.has(member.id) ? 'expanded' : ''}`}
                                  />
                                </button>
                                {member.id}
                              </td>
                            <td>{member.name || '-'}</td>
                            <td>-</td>
                            <td>{member.address || '-'}</td>
                            <td>{member.location ? member.location.charAt(0).toUpperCase() + member.location.slice(1) : '-'}</td>
                            <td>{member.phone || '-'}</td>
                            <td>{member.training_type || '-'}</td>
                            <td>{formatDate(member.created_at)}</td>
                            <td>-</td>
                            <td title={member.email || '-'} className="email-cell">
                              {member.email || '-'}
                            </td>
                            <td>
                              {member.image_url ? (
                                <img 
                                  src={getImageUrl(member.image_url)} 
                                  alt={member.name}
                                  className="member-photo"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const placeholder = e.target.parentElement.querySelector('.member-photo-placeholder');
                                    if (placeholder) {
                                      placeholder.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div className="member-photo-placeholder" style={{ display: member.image_url ? 'none' : 'flex' }}>
                                <FontAwesomeIcon icon={faPlus} />
                              </div>
                            </td>
                            <td>{formatDate(member.start_date)}</td>
                            <td>
                              <div className="action-icons">
                                <button
                                  onClick={() => handleEdit(member)}
                                  className="icon-edit-btn"
                                  title="Edit Member"
                                  aria-label="Edit Member"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <WhatsAppButton 
                                  phone={member.phone} 
                                  message={`Hi ${member.name}, `}
                                  iconOnly={true}
                                />
                              </div>
                            </td>
                          </tr>
                          {expandedRows.has(member.id) && (
                            <tr className="expanded-row">
                              <td colSpan="13" className="expanded-content">
                                <div className="member-details-expanded">
                                  <div className="detail-item">
                                    <span className="detail-label">ContractTill:</span>
                                    <span className="detail-value">{formatDate(member.end_date)}</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Plan:</span>
                                    <span className="detail-value">{member.membership_type || '-'}</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Due Date:</span>
                                    <span className="detail-value">{calculateDueDate(member.end_date)}</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Due:</span>
                                    <span className="detail-value">₹0.00</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Status:</span>
                                    <span className={`status-badge status-${member.status?.toLowerCase()}`}>
                                      {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : '-'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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
        ) : filterStatus === 'expired' ? (
          <>
            {/* Breadcrumb */}
            <div className="members-table-breadcrumb">
              <Link to="/admin">
                <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
                Home
              </Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <Link to="/admin/members">Members</Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <span className="breadcrumb-current">Dues</span>
            </div>

            {/* Header */}
            <div className="members-table-header">
              <div className="members-table-title-section">
                <h1 className="members-table-main-title">Members</h1>
                <span className="members-table-sub-title">Dues</span>
              </div>
            </div>

            {/* Filters Section */}
            <div className="active-members-filters">
              <div className="filters-header">
                <h3>Filters</h3>
                <button
                  type="button"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="collapse-toggle-btn"
                >
                  <FontAwesomeIcon icon={filtersExpanded ? faChevronUp : faChevronDown} />
                </button>
              </div>
              {filtersExpanded && (
                <div className="filters-content">
                  <input
                    type="text"
                    placeholder="MembershipId"
                    value={filterMembershipId}
                    onChange={(e) => setFilterMembershipId(e.target.value)}
                    className="filter-input"
                  />
                  <DateRangePicker
                    value={filterDateRange}
                    onChange={(value) => setFilterDateRange(value)}
                    placeholder="Date Range"
                  />
                  <button className="filter-view-btn">View</button>
                </div>
              )}
            </div>

            {/* List of Members with Due Section */}
            <div className="active-members-list">
              <div className="list-header">
                <h3>List of Members with Due</h3>
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
                            <th onClick={() => handleSort('created_at')} className="sortable">
                              Joining Date {getSortIcon('created_at')}
                            </th>
                            <th onClick={() => handleSort('address')} className="sortable">
                              Address {getSortIcon('address')}
                            </th>
                            <th onClick={() => handleSort('phone')} className="sortable">
                              Phone {getSortIcon('phone')}
                            </th>
                            <th onClick={() => handleSort('email')} className="sortable">
                              Email {getSortIcon('email')}
                            </th>
                            <th onClick={() => handleSort('start_date')} className="sortable">
                              From {getSortIcon('start_date')}
                            </th>
                            <th onClick={() => handleSort('membership_type')} className="sortable">
                              Plan {getSortIcon('membership_type')}
                            </th>
                            <th onClick={() => handleSort('end_date')} className="sortable">
                              Due Date {getSortIcon('end_date')}
                            </th>
                            <th onClick={() => handleSort('due_amount')} className="sortable">
                              Due {getSortIcon('due_amount')}
                            </th>
                            <th>Photo</th>
                            <th onClick={() => handleSort('status')} className="sortable">
                              Status {getSortIcon('status')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedMembers.length === 0 ? (
                            <tr>
                              <td colSpan="12" style={{ textAlign: 'center', padding: '40px' }}>
                                No members found
                              </td>
                            </tr>
                          ) : (
                            paginatedMembers.map((member) => (
                              <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.name || '-'}</td>
                                <td>{formatDate(member.created_at)}</td>
                                <td>{member.address || '-'}</td>
                                <td>{member.phone || '-'}</td>
                                <td title={member.email || '-'} className="email-cell">
                                  {member.email || '-'}
                                </td>
                                <td>{formatDate(member.start_date)}</td>
                                <td>{member.membership_type || '-'}</td>
                                <td>{calculateDueDate(member.end_date)}</td>
                                <td>
                                  {member.due_amount 
                                    ? `₹${parseFloat(member.due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : '₹0.00'}
                                </td>
                                <td>
                                  {member.image_url ? (
                                    <img 
                                      src={getImageUrl(member.image_url)} 
                                      alt={member.name}
                                      className="member-photo"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const placeholder = e.target.parentElement.querySelector('.member-photo-placeholder');
                                        if (placeholder) {
                                          placeholder.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div className="member-photo-placeholder" style={{ display: member.image_url ? 'none' : 'flex' }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-badge status-${member.status?.toLowerCase()}`}>
                                    {member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : '-'}
                                  </span>
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
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} entries
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
          </>
        ) : null}

        <MemberFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          member={editingMember}
          trainers={trainers}
        />
      </div>
    </div>
  );
};

export default MembersManagementPage;
