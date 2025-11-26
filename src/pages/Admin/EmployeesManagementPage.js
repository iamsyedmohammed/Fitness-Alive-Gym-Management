import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome, faSort, faSortUp, faSortDown, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import TrainerFormModal from '../../components/admin/TrainerFormModal';
import WhatsAppButton from '../../components/admin/WhatsAppButton';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './MembersTablePage.css';

const EmployeesManagementPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');

    if (statusParam) {
      setFilterStatus(statusParam);
    } else {
      setFilterStatus('all');
    }
  }, [location.search]);

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        const fetchedTrainers = data.trainers || [];
        setTrainers(fetchedTrainers);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      const url = editingTrainer
        ? `${API_BASE_URL}/updateTrainer.php`
        : `${API_BASE_URL}/addTrainer.php`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTrainer ? { ...formData, id: editingTrainer.id } : formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchTrainers();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Error saving employee');
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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `https://slateblue-turkey-331136.hostingersite.com${imageUrl}`;
    }
    return `https://slateblue-turkey-331136.hostingersite.com/${imageUrl}`;
  };

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch = 
      trainer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.phone?.includes(searchTerm) ||
      trainer.trainer_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && trainer.is_active) ||
      (filterStatus === 'inactive' && !trainer.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (sortColumn === 'id') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    } else if (sortColumn === 'created_at' || sortColumn === 'date_of_birth') {
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

  const totalPages = Math.ceil(sortedTrainers.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedTrainers = sortedTrainers.slice(startIndex, endIndex);

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

  const toggleRow = (trainerId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trainerId)) {
        newSet.delete(trainerId);
      } else {
        newSet.add(trainerId);
      }
      return newSet;
    });
  };

  const isAllEmployeesPage = filterStatus === 'all' || !filterStatus;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        {isAllEmployeesPage ? (
          <>
            {/* Breadcrumb */}
            <div className="members-table-breadcrumb">
              <Link to="/admin">
                <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
                Home
              </Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <Link to="/admin/employees">Employees</Link>
              <span className="breadcrumb-separator"> &gt; </span>
              <span className="breadcrumb-current">All Employees</span>
            </div>

            {/* Header */}
            <div className="members-table-header">
              <div className="members-table-title-section">
                <h1 className="members-table-main-title">Employees</h1>
                <span className="members-table-sub-title">All Employees</span>
              </div>
            </div>

            {/* Divider */}
            <div className="members-table-divider"></div>

            {/* Page Title */}
            <h2 className="members-table-page-title">List of All Employees with Complete Details</h2>

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
                      <table className="members-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('id')} className="sortable">
                            EMP No {getSortIcon('id')}
                          </th>
                          <th onClick={() => handleSort('name')} className="sortable">
                            Name {getSortIcon('name')}
                          </th>
                          <th onClick={() => handleSort('date_of_birth')} className="sortable">
                            Birthdate {getSortIcon('date_of_birth')}
                          </th>
                          <th onClick={() => handleSort('phone')} className="sortable">
                            Phone Number {getSortIcon('phone')}
                          </th>
                          <th onClick={() => handleSort('address')} className="sortable">
                            Address {getSortIcon('address')}
                          </th>
                          <th onClick={() => handleSort('shift')} className="sortable">
                            Shift {getSortIcon('shift')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTrainers.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                              No employees found
                            </td>
                          </tr>
                        ) : (
                          paginatedTrainers.map((trainer) => (
                            <tr key={trainer.id}>
                              <td>{trainer.id}</td>
                              <td>{trainer.name || '-'}</td>
                              <td>{formatDate(trainer.date_of_birth)}</td>
                              <td>{trainer.phone || '-'}</td>
                              <td>{trainer.address || '-'}</td>
                              <td>{trainer.shift || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="members-table-pagination">
                    <div className="pagination-info">
                      Showing {startIndex + 1} to {Math.min(endIndex, sortedTrainers.length)} of {sortedTrainers.length} entries
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
          </>
        ) : (
          <div className="data-table">
            <div className="table-header">
              <h2>Employees ({filteredTrainers.length})</h2>
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
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Specialization</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrainers.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      filteredTrainers.map((trainer) => (
                        <tr key={trainer.id}>
                          <td>
                            {trainer.image_url ? (
                              <img 
                                src={getImageUrl(trainer.image_url)} 
                                alt={trainer.name}
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
                            <div className="table-member-image-placeholder" style={{ display: trainer.image_url ? 'none' : 'flex' }}>
                              No Image
                            </div>
                          </td>
                          <td><strong>{trainer.trainer_code || '-'}</strong></td>
                          <td>{trainer.name}</td>
                          <td>{trainer.email || '-'}</td>
                          <td>{trainer.phone || '-'}</td>
                          <td>{trainer.specialization || '-'}</td>
                          <td>
                            <span className={`status-badge ${trainer.is_active ? 'status-active' : 'status-inactive'}`}>
                              {trainer.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEdit(trainer)}
                                className="btn-small btn-edit"
                              >
                                Edit
                              </button>
                              <WhatsAppButton phone={trainer.phone} message={`Hi ${trainer.name}, `} />
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

        <TrainerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          trainer={editingTrainer}
        />
      </div>
    </div>
  );
};

export default EmployeesManagementPage;
