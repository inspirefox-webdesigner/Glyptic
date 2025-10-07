import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';

const GalleryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setToast({ show: true, message: 'Please select at least one image', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post('http://localhost:5000/api/gallery', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(uploadPromises);
      setToast({ show: true, message: 'Images uploaded successfully!', type: 'success' });
      setTimeout(() => navigate('/gallery'), 1500);
    } catch (error) {
      console.error('Error uploading images:', error);
      const errorMessage = error.response?.data?.error || 'Error uploading images. Please try again.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      <div className="page-header">
        <h1 className="page-title">Add Gallery Images</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Select Images</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={loading}
            />
            <small className="form-text text-muted">
              You can select multiple images at once. Supported formats: JPG, PNG, GIF, WebP
            </small>
          </div>

          {loading && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Uploading...</span>
              </div>
              <p>Uploading images...</p>
            </div>
          )}

          <div className="form-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/gallery')}
              disabled={loading}
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;