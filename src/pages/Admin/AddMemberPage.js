import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const AddMemberPage = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [nextId, setNextId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    
    // Screenshot fields
    payment_date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0], // Contract Begin Date
    membership_type: '', // Plan Type
    end_date: '', // Contract End Date
    discount: 0,
    due_amount: 0,
    shift: '', // Preferred shift
    trainer_id: '', // Employee Name
    price: '', // Membership Fee
    registration_fee: '', // Initial Fee
    recurring_amount: '', // Recurring Amount
    next_bill_date: '', // Next Bill Date

    training_type: '', // Keep for compatibility if needed, or can be inferred from plan
    status: 'active',
    image_url: '',
    location: 'yakutpura',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTrainers();
    fetchNextId();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        setTrainers(data.trainers || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchNextId = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getNextId.php`);
        const data = await response.json();
        if (data.success) {
            setNextId(data.next_id);
        }
      } catch (err) {
          console.error('Error fetching next ID:', err);
      }
  };

  const calculateEndDate = (startDate, membershipType) => {
    if (!startDate || !membershipType) return { endDate: '', nextBillDate: '' };
    
    const start = new Date(startDate);
    let daysToAdd = 0;
    
    switch (membershipType) {
      case 'Half Month':
        daysToAdd = 15;
        break;
      case 'GYM':
      case 'CARDIO':
      case 'Mor + Eve':
        daysToAdd = 30;
        break;
      case 'Two Months':
        daysToAdd = 60;
        break;
      case 'GYM-Quarterly':
      case 'CARDIO-Quaterly':
        daysToAdd = 90; // Standard 3 months approx
        break;
      case 'GYM - Half Yearly':
      case 'CARDIO - Half Yearly':
        daysToAdd = 180;
        break;
      case 'GYM - 1 Year':
      case 'CARDIO - 1 Year':
        daysToAdd = 365;
        break;
      default:
        // Handle legacy types if any
        if (membershipType === 'Monthly') daysToAdd = 30;
        if (membershipType === 'Quarterly') daysToAdd = 90;
        if (membershipType === 'Half Yearly') daysToAdd = 180;
        if (membershipType === 'Yearly') daysToAdd = 365;
        break;
    }
    
    if (daysToAdd > 0) {
      const endDateObj = new Date(start);
      endDateObj.setDate(endDateObj.getDate() + daysToAdd);
      const endDate = endDateObj.toISOString().split('T')[0];

      // Next Bill Date is Contract End Date + 1 day
      const nextBillDateObj = new Date(endDateObj);
      nextBillDateObj.setDate(nextBillDateObj.getDate() + 1);
      const nextBillDate = nextBillDateObj.toISOString().split('T')[0];

      return { endDate, nextBillDate };
    }
    
    return { endDate: '', nextBillDate: '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    
    // Auto-calculate end_date and next_bill_date when membership_type or start_date changes
    if (name === 'membership_type' || name === 'start_date') {
      if (updatedFormData.membership_type && updatedFormData.start_date) {
        const { endDate, nextBillDate } = calculateEndDate(updatedFormData.start_date, updatedFormData.membership_type);
        if (endDate) {
          updatedFormData.end_date = endDate;
          updatedFormData.next_bill_date = nextBillDate;
        }
      }
    }
    
    // Auto-calculate next_bill_date when end_date is manually changed
    if (name === 'end_date' && value) {
      const endDateObj = new Date(value);
      const nextBillDateObj = new Date(endDateObj);
      nextBillDateObj.setDate(nextBillDateObj.getDate() + 1);
      updatedFormData.next_bill_date = nextBillDateObj.toISOString().split('T')[0];
    }
    
    setFormData(updatedFormData);
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
    setUploading(true);
    
    let finalFormData = { ...formData };

    // Upload image if a new file is selected
    if (imageFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        uploadFormData.append('type', 'member');
        
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
      const response = await fetch(`${API_BASE_URL}/addMember.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/admin/members');
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Error saving member');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <button onClick={() => navigate('/admin/members')} className="back-btn">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <h1>Add New Member</h1>
          {nextId && <div className="membership-id-badge">Membership ID : {nextId}</div>}
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter member name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter full address"
                />
              </div>
              
              <div className="form-group">
                  <label>Profile Image</label>
                  <div className="image-upload-container">
                    {imagePreview ? (
                        <div className="image-preview">
                        <img src={imagePreview} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                        <button type="button" onClick={removeImage} className="remove-image-btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        </div>
                    ) : (
                        <label className="image-upload-label">
                        <FontAwesomeIcon icon={faImage} />
                        <span>Choose Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        </label>
                    )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Membership Details</h3>
              
              {/* Row 1: Payment Date & Contract Begin Date */}
              <div className="form-row">
                  <div className="form-group">
                      <label>Payment Date *</label>
                      <input 
                          type="date"
                          name="payment_date"
                          value={formData.payment_date}
                          onChange={handleChange}
                          required
                      />
                  </div>
                  <div className="form-group">
                      <label>Contract Begin Date *</label>
                      <input 
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                          required
                      />
                  </div>
              </div>

              {/* Row 2: Plan Type & Contract End Date */}
              <div className="form-row">
                  <div className="form-group">
                      <label>Plan Type *</label>
                      <select
                        name="membership_type"
                        value={formData.membership_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="CARDIO - 1 Year">CARDIO - 1 Year</option>
                        <option value="Half Month">Half Month</option>
                        <option value="GYM">GYM</option>
                        <option value="GYM-Quarterly">GYM-Quarterly</option>
                        <option value="GYM - 1 Year">GYM - 1 Year</option>
                        <option value="GYM - Half Yearly">GYM - Half Yearly</option>
                        <option value="CARDIO">CARDIO</option>
                        <option value="CARDIO-Quaterly">CARDIO-Quaterly</option>
                        <option value="CARDIO - Half Yearly">CARDIO - Half Yearly</option>
                        <option value="Mor + Eve">Mor + Eve</option>
                        <option value="Two Months">Two Months</option>
                      </select>
                  </div>
                  <div className="form-group">
                      <label>Contract End Date *</label>
                      <input 
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          required
                      />
                  </div>
              </div>

              {/* Row 3: Discount & Due Amount */}
              <div className="form-row">
                  <div className="form-group">
                      <label>Discount *</label>
                      <input 
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          min="0"
                      />
                  </div>
                  <div className="form-group">
                      <label>Due Amount *</label>
                      <input 
                          type="number"
                          name="due_amount"
                          value={formData.due_amount}
                          onChange={handleChange}
                          min="0"
                      />
                  </div>
              </div>

              {/* Row 4: Preferred shift & Employee Name */}
              <div className="form-row">
                  <div className="form-group">
                      <label>Preferred shift *</label>
                      <select
                          name="shift"
                          value={formData.shift}
                          onChange={handleChange}
                      >
                          <option value="">Select</option>
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                      </select>
                  </div>
                  <div className="form-group">
                      <label>Employee Name *</label>
                      <select
                        name="trainer_id"
                        value={formData.trainer_id}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {trainers.map((trainer) => (
                          <option key={trainer.id} value={trainer.id}>
                            {trainer.name}
                          </option>
                        ))}
                      </select>
                  </div>
              </div>

              {/* Row 5: Membership Fee & Initial Fee */}
              <div className="form-row">
                  <div className="form-group">
                      <label>Membership Fee *</label>
                      <input 
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="Enter price"
                      />
                  </div>
                  <div className="form-group">
                      <label>Initial Fee *</label>
                      <input 
                          type="number"
                          name="registration_fee"
                          value={formData.registration_fee}
                          onChange={handleChange}
                          placeholder="Enter registration fee"
                      />
                  </div>
              </div>

              {/* Row 6: Recurring Amount & Next Bill Date */}
              <div className="form-row">
                  <div className="form-group">
                      <label>Recurring Amount *</label>
                      <input 
                          type="number"
                          name="recurring_amount"
                          value={formData.recurring_amount}
                          onChange={handleChange}
                      />
                  </div>
                  <div className="form-group">
                      <label>Next Bill Date *</label>
                      <input 
                          type="date"
                          name="next_bill_date"
                          value={formData.next_bill_date}
                          onChange={handleChange}
                          readOnly
                          style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                          title="Auto-calculated as Contract End Date + 1 day"
                      />
                  </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '20px' }}>
                 <label>Training Type (Internal)</label>
                  <select
                    name="training_type"
                    value={formData.training_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Training Type</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Weight Training">Weight Training</option>
                  </select>
              </div>

            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/admin/members')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberPage;
