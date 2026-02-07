import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({
    emailAddress: {
      title: 'Email address',
      emails: ['']
    },
    phoneNumber: {
      title: 'Phone number',
      phones: ['']
    },
    location: {
      title: 'Our Location',
      address: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact-info`);
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      if (response.ok) {
        alert('Contact information updated successfully!');
      } else {
        alert('Error updating contact information');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Error saving contact information');
    } finally {
      setSaving(false);
    }
  };

  const addEmail = () => {
    setContactInfo(prev => ({
      ...prev,
      emailAddress: {
        ...prev.emailAddress,
        emails: [...prev.emailAddress.emails, '']
      }
    }));
  };

  const removeEmail = (index) => {
    setContactInfo(prev => ({
      ...prev,
      emailAddress: {
        ...prev.emailAddress,
        emails: prev.emailAddress.emails.filter((_, i) => i !== index)
      }
    }));
  };

  const updateEmail = (index, value) => {
    setContactInfo(prev => ({
      ...prev,
      emailAddress: {
        ...prev.emailAddress,
        emails: prev.emailAddress.emails.map((email, i) => i === index ? value : email)
      }
    }));
  };

  const addPhone = () => {
    setContactInfo(prev => ({
      ...prev,
      phoneNumber: {
        ...prev.phoneNumber,
        phones: [...prev.phoneNumber.phones, '']
      }
    }));
  };

  const removePhone = (index) => {
    setContactInfo(prev => ({
      ...prev,
      phoneNumber: {
        ...prev.phoneNumber,
        phones: prev.phoneNumber.phones.filter((_, i) => i !== index)
      }
    }));
  };

  const updatePhone = (index, value) => {
    setContactInfo(prev => ({
      ...prev,
      phoneNumber: {
        ...prev.phoneNumber,
        phones: prev.phoneNumber.phones.map((phone, i) => i === index ? value : phone)
      }
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading contact information...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Contact Us Management</h1>
          <p className="page-subtitle">Manage contact information displayed on the website</p>
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
          {/* Email Address Section */}
          <div className="form-section">
            <div className="form-group">
              <p className="form-label">Email Section Title</p>
              <input
                type="text"
                className="form-input"
                value={contactInfo.emailAddress.title}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  emailAddress: { ...prev.emailAddress, title: e.target.value }
                }))}
                placeholder="Enter email section title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Addresses</label>
              {contactInfo.emailAddress.emails.map((email, index) => (
                <div key={index} className="contact-input-group">
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="Enter email address"
                  />
                  <div className="contact-input-actions">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeEmail(index)}
                      disabled={contactInfo.emailAddress.emails.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addEmail}
              >
                Add Email
              </button>
            </div>
          </div>

          {/* Phone Number Section */}
          <div className="form-section">
            <div className="form-group">
              <p className="form-label">Phone Section Title</p>
              <input
                type="text"
                className="form-input"
                value={contactInfo.phoneNumber.title}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  phoneNumber: { ...prev.phoneNumber, title: e.target.value }
                }))}
                placeholder="Enter phone section title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Numbers</label>
              {contactInfo.phoneNumber.phones.map((phone, index) => (
                <div key={index} className="contact-input-group">
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder="Enter phone number"
                  />
                  <div className="contact-input-actions">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removePhone(index)}
                      disabled={contactInfo.phoneNumber.phones.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addPhone}
              >
                Add Phone
              </button>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="form-section">
          <div className="form-group">
            <p className="form-label">Location Section Title</p>
            <input
              type="text"
              className="form-input"
              value={contactInfo.location.title}
              onChange={(e) => setContactInfo(prev => ({
                ...prev,
                location: { ...prev.location, title: e.target.value }
              }))}
              placeholder="Enter location section title"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-input"
              rows="4"
              value={contactInfo.location.address}
              onChange={(e) => setContactInfo(prev => ({
                ...prev,
                location: { ...prev.location, address: e.target.value }
              }))}
              placeholder="Enter complete address"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;