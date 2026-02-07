import React, { useState, useEffect } from 'react';
import  API_BASE_URL  from '../config/api';

const HomePage = () => {
  const [homeData, setHomeData] = useState({
    whoWeAre: {
      image: '',
      mainHeading: 'Who We Are?',
      tagline: 'Empowering Integrators, Safeguarding Industries',
      description: '',
      partnerText: 'Glyptic: Partnering with pros to protect what matters most!',
      certifiedText: 'Certified & Awards winner',
      qualityText: 'Best Quality Services'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/home-page`);
      if (response.ok) {
        const data = await response.json();
        setHomeData(data);
        if (data.whoWeAre.image) {
          setImagePreview(data.whoWeAre.image.startsWith('http') ? 
            data.whoWeAre.image : 
            `${API_BASE_URL.replace('/api', '')}/uploads/${data.whoWeAre.image}`
          );
        }
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/home-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homeData),
      });

      if (response.ok) {
        alert('Home page content updated successfully!');
      } else {
        alert('Error updating home page content');
      }
    } catch (error) {
      console.error('Error saving home data:', error);
      alert('Error saving home page content');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/home-page/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setHomeData(prev => ({
          ...prev,
          whoWeAre: { ...prev.whoWeAre, image: data.imageUrl }
        }));
        setImagePreview(`${API_BASE_URL.replace('/api', '')}/uploads/${data.imageUrl}`);
      } else {
        alert('Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading home page content...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Home Page Management</h1>
          <p className="page-subtitle">Manage "Who We Are?" section content</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="content-card">
        <div className="form-grid">
          {/* Image Section */}
          <div className="form-section">
            <div className="form-group">
              <p className="form-label">Section Image</p>
              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-input-file"
                  disabled={uploading}
                />
                <div className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  {uploading ? 'Uploading...' : 'Choose Image'}
                </div>
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="form-section">
            <div className="form-group">
              <p className="form-label">Main Heading</p>
              <input
                type="text"
                className="form-input"
                value={homeData.whoWeAre.mainHeading}
                onChange={(e) => setHomeData(prev => ({
                  ...prev,
                  whoWeAre: { ...prev.whoWeAre, mainHeading: e.target.value }
                }))}
                placeholder="Enter main heading"
              />
            </div>

            <div className="form-group">
              <p className="form-label">Tagline</p>
              <input
                type="text"
                className="form-input"
                value={homeData.whoWeAre.tagline}
                onChange={(e) => setHomeData(prev => ({
                  ...prev,
                  whoWeAre: { ...prev.whoWeAre, tagline: e.target.value }
                }))}
                placeholder="Enter tagline"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="6"
                value={homeData.whoWeAre.description}
                onChange={(e) => setHomeData(prev => ({
                  ...prev,
                  whoWeAre: { ...prev.whoWeAre, description: e.target.value }
                }))}
                placeholder="Enter description text"
              />
            </div>

            <div className="form-group">
              <p className="form-label">Partner Text</p>
              <input
                type="text"
                className="form-input"
                value={homeData.whoWeAre.partnerText}
                onChange={(e) => setHomeData(prev => ({
                  ...prev,
                  whoWeAre: { ...prev.whoWeAre, partnerText: e.target.value }
                }))}
                placeholder="Enter partner text"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="form-grid">
          <div className="form-section">
            <div className="form-group">
              <p className="form-label">Certified Text</p>
              <input
                type="text"
                className="form-input"
                value={homeData.whoWeAre.certifiedText}
                onChange={(e) => setHomeData(prev => ({
                  ...prev,
                  whoWeAre: { ...prev.whoWeAre, certifiedText: e.target.value }
                }))}
                placeholder="Enter certified text"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <p className="form-label">Quality Text</p>
              <input
                type="text"
                className="form-input"
                value={homeData.whoWeAre.qualityText}
                onChange={(e) => setHomeData(prev => ({
                  ...prev,
                  whoWeAre: { ...prev.whoWeAre, qualityText: e.target.value }
                }))}
                placeholder="Enter quality text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;