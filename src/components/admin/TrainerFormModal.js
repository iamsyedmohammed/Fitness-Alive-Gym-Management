import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../config/api';
import './Modal.css';

const TrainerFormModal = ({ isOpen, onClose, onSave, trainer = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    bio: '',
    image_url: '',
    is_active: true,
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
    if (trainer) {
      setFormData({
        ...trainer,
        location: trainer.location || 'yakutpura',
        address: trainer.address || '',
      });
      setImagePreview(getImageUrl(trainer.image_url || ''));
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        specialization: '',
        experience: '',
        bio: '',
        image_url: '',
        is_active: true,
        location: 'yakutpura',
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [trainer, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
        uploadFormData.append('type', 'trainer');
        
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
          <h2>{trainer ? 'Edit Trainer' : 'Add New Trainer'}</h2>
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
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Weight Training, Yoga"
              />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
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
            {formData.image_url && !imagePreview && (
              <p className="image-url-info">Current image: {formData.image_url}</p>
            )}
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : (trainer ? 'Update' : 'Add') + ' Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerFormModal;

