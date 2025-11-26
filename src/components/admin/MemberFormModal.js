import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../config/api';
import './Modal.css';

const MemberFormModal = ({ isOpen, onClose, onSave, member = null, trainers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membership_type: '',
    training_type: '',
    price: '',
    start_date: '',
    end_date: '',
    status: 'active',
    trainer_id: '',
    image_url: '',
    location: 'yakutpura',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        trainer_id: member.trainer_id || '',
        image_url: member.image_url || '',
        location: member.location || 'yakutpura',
        address: member.address || '',
        training_type: member.training_type || '',
        price: member.price || '',
      });
      setImagePreview(getImageUrl(member.image_url || ''));
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        membership_type: '',
        training_type: '',
        price: '',
        start_date: today,
        end_date: '',
        status: 'active',
        trainer_id: '',
        image_url: '',
        location: 'yakutpura',
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [member, isOpen]);

  const calculateEndDate = (startDate, membershipType) => {
    if (!startDate || !membershipType) return '';
    
    const start = new Date(startDate);
    let daysToAdd = 0;
    
    if (membershipType === 'Monthly') {
      daysToAdd = 30;
    } else if (membershipType === 'Quarterly') {
      daysToAdd = 160;
    } else if (membershipType === 'Half Yearly') {
      daysToAdd = 180;
    } else if (membershipType === 'Yearly') {
      daysToAdd = 365;
    }
    
    if (daysToAdd > 0) {
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + daysToAdd);
      return endDate.toISOString().split('T')[0];
    }
    
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    
    // Auto-calculate end_date when membership_type or start_date changes
    if (name === 'membership_type' || name === 'start_date') {
      if (updatedFormData.membership_type && updatedFormData.start_date) {
        const calculatedEndDate = calculateEndDate(updatedFormData.start_date, updatedFormData.membership_type);
        if (calculatedEndDate) {
          updatedFormData.end_date = calculatedEndDate;
        }
      }
    }
    
    setFormData(updatedFormData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB)
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
    
    // Upload image if a new file is selected
    if (imageFile) {
      setUploading(true);
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
          formData.image_url = uploadData.url;
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
      setUploading(false);
    }
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{member ? 'Edit Member' : 'Add New Member'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
          <div className="form-row">
            <div className="form-group">
              <label>Training Type *</label>
              <select
                name="training_type"
                value={formData.training_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Training Type</option>
                <option value="Cardio">Cardio</option>
                <option value="Weight Training">Weight Training</option>
              </select>
            </div>
            <div className="form-group">
              <label>Membership Type *</label>
              <select
                name="membership_type"
                value={formData.membership_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Assign Trainer</label>
            <select
              name="trainer_id"
              value={formData.trainer_id}
              onChange={handleChange}
            >
              <option value="">No Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>
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
            {formData.image_url && !imagePreview && (
              <p className="image-url-info">Current image: {formData.image_url}</p>
            )}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : (member ? 'Update' : 'Add') + ' Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;

