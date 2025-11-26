import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';
import './AddEmployeePage.css';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const [nextId, setNextId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    date_of_birth: '',
    address: '',
    shift: '',
    image_url: '',
    location: 'yakutpura',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNextId();
  }, []);

  const fetchNextId = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        const trainers = data.trainers || [];
        const maxId = trainers.length > 0 
          ? Math.max(...trainers.map(t => parseInt(t.id) || 0))
          : 0;
        setNextId((maxId + 1).toString());
      }
    } catch (err) {
      console.error('Error fetching next ID:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.gender || !formData.phone || !formData.date_of_birth || !formData.address || !formData.shift) {
      alert('Please fill in all required fields');
      return;
    }

    if (!imageFile && !formData.image_url) {
      alert('Please upload an image');
      return;
    }

    setUploading(true);
    
    let finalFormData = { ...formData };

    // Upload image if a new file is selected
    if (imageFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        uploadFormData.append('type', 'trainer');
        
        const uploadResponse = await fetch(`${API_BASE_URL}/uploadImage.php`, {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          finalFormData.image_url = uploadData.url;
        } else {
          alert(uploadData.error || 'Failed to upload image');
          setUploading(false);
          return;
        }
      } catch (err) {
        alert('Error uploading image: ' + err.message);
        setUploading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/addTrainer.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalFormData,
          is_active: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/admin/employees');
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Error saving employee');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content employee-add-content">
        {/* Header Bar */}
        <div className="employee-register-header">
          <span className="employee-register-title">Employees Register</span>
        </div>

        {/* Breadcrumb */}
        <div className="employee-add-breadcrumb">
          <Link to="/admin">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            Home
          </Link>
          <span className="breadcrumb-separator"> / </span>
          <Link to="/admin/employees">Employees</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">SignUp</span>
        </div>

        {/* Employee ID */}
        <div className="employee-id-display">
          ID : {nextId || '...'}
        </div>

        {/* Main Title Banner */}
        <div className="employee-details-banner">
          <h1>Employee Details</h1>
        </div>

        {/* Form */}
        <div className="employee-form-container">
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="employee-form-row">
              {/* Left Column */}
              <div className="employee-form-column">
                <div className="employee-form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                  />
                </div>

                <div className="employee-form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="employee-form-group">
                  <label>Upload Image *</label>
                  <div className="employee-image-upload">
                    {imagePreview ? (
                      <div className="employee-image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button type="button" onClick={removeImage} className="remove-image-btn">
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <label className="employee-image-upload-label">
                        <FontAwesomeIcon icon={faImage} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="employee-form-column">
                <div className="employee-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="employee-form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="employee-form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter address"
                  />
                </div>

                <div className="employee-form-group">
                  <label>Shift *</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <div className="employee-form-actions">
              <button type="submit" className="employee-done-btn" disabled={uploading}>
                {uploading ? 'Saving...' : 'Done'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeePage;
