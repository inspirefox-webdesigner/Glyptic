import { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailSettings: {
      adminEmail: 'webdesigner2502@gmail.com',
      emailEnabled: true
    },
    passwordSettings: {
      currentPassword: 'admin123'
    }
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await axios.put('http://localhost:5000/api/admin-settings', settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      emailSettings: {
        ...prev.emailSettings,
        [field]: value
      }
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setSavingPassword(false);
      return;
    }

    if (passwordForm.currentPassword !== settings.passwordSettings.currentPassword) {
      setPasswordMessage('Current password is incorrect');
      setSavingPassword(false);
      return;
    }

    try {
      const updatedSettings = {
        ...settings,
        passwordSettings: {
          currentPassword: passwordForm.newPassword
        }
      };
      
      await axios.put('http://localhost:5000/api/admin-settings', updatedSettings);
      setSettings(updatedSettings);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage('Password changed successfully!');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage('Error changing password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading Settings...</div>;
  }

  return (
    <div className="container-fluid"  >
      <div className="page-header">
        <h1 className="page-title" style={{ color: '#000' }}>
          Admin Settings
        </h1>
      </div>

      <div className="row" style={{ margin: '20px 0', display: 'flex', gap: '20px' }}>
        {/* Password Change Grid */}
        <div className="col-md-6" style={{ paddingRight: '10px' , width: '50%' }}>
          <div className="card" style={{ height: '500px', width: '100%' }}>
            <div className="card-body" style={{ padding: '25px' }}>
              <h3 style={{ color: '#000', marginBottom: '20px', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>
                🔒 Change Password
              </h3>
              
              <form onSubmit={handlePasswordChange}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="form-control"
                    style={{ padding: '12px 15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="form-control"
                    style={{ padding: '12px 15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="form-control"
                    style={{ padding: '12px 15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {passwordMessage && (
                  <div 
                    className={`alert ${passwordMessage.includes('Error') || passwordMessage.includes('incorrect') || passwordMessage.includes('not match') ? 'alert-danger' : 'alert-success'}`}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '5px',
                      marginBottom: '15px',
                      backgroundColor: passwordMessage.includes('Error') || passwordMessage.includes('incorrect') || passwordMessage.includes('not match') ? '#f8d7da' : '#d4edda',
                      color: passwordMessage.includes('Error') || passwordMessage.includes('incorrect') || passwordMessage.includes('not match') ? '#721c24' : '#155724',
                      border: `1px solid ${passwordMessage.includes('Error') || passwordMessage.includes('incorrect') || passwordMessage.includes('not match') ? '#f5c6cb' : '#c3e6cb'}`
                    }}
                  >
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="btn btn-danger"
                  style={{
                    backgroundColor: '#dc3545',
                    border: 'none',
                    padding: '10px 25px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: savingPassword ? 'not-allowed' : 'pointer',
                    opacity: savingPassword ? 0.7 : 1,
                    width: '100%'
                  }}
                >
                  {savingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>



          {/* Do not delete this code*/}
          {/* This code is not delete but commented for future use.         */}

        {/* <div className="col-md-6" style={{ paddingLeft: '10px' }}>
          <div className="card" style={{ height: '500px', width: '100%' }}>
            <div className="card-body" style={{ padding: '25px' }}>
              <h3 style={{ color: '#000', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                📧 Send Email Notifications
              </h3>
              
              <form onSubmit={handleSave}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Admin Email Address *
                  </label>
                  <input
                    type="email"
                    value={settings.emailSettings.adminEmail}
                    onChange={(e) => handleEmailChange('adminEmail', e.target.value)}
                    className="form-control"
                    style={{ padding: '12px 15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
                    placeholder="emailer@glyptic.in"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    This email will receive notifications for career applications and contact forms.
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.emailSettings.emailEnabled}
                      onChange={(e) => handleEmailChange('emailEnabled', e.target.checked)}
                      style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                    />
                    Enable Email Notifications
                  </label>
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block', marginLeft: '30px' }}>
                    Uncheck to disable all email notifications temporarily.
                  </small>
                </div>

                {message && (
                  <div 
                    className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '5px',
                      marginBottom: '15px',
                      backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
                      color: message.includes('Error') ? '#721c24' : '#155724',
                      border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
                    }}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#007bff',
                    border: 'none',
                    padding: '10px 25px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    width: '100%'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Email Settings'}
                </button>
              </form>
            </div>
          </div>
        </div> */}
        


      </div>
    </div>
  );
};

export default Settings;