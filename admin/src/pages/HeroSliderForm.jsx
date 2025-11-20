import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const HeroSliderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    isActive: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchSlide();
    }
  }, [id, isEdit]);

  const fetchSlide = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/hero-slider/${id}`);
      const slide = await response.json();
      setFormData({
        title: slide.title,
        isActive: slide.isActive
      });
      setImagePreview(`http://localhost:5000/uploads/${slide.image}`);
    } catch (error) {
      console.error('Error fetching slide:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!isEdit && !image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('isActive', formData.isActive);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const url = isEdit 
        ? `http://localhost:5000/api/hero-slider/${id}`
        : 'http://localhost:5000/api/hero-slider';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        navigate('/hero-slider');
      } else {
        const errorData = await response.json();
        console.error('Error saving slide:', errorData);
      }
    } catch (error) {
      console.error('Error saving slide:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            {isEdit ? 'Edit Hero Slide' : 'Add New Hero Slide'}
          </h1>
          <p className="page-subtitle">
            {isEdit ? 'Update slide information' : 'Create a new hero slider slide'}
          </p>
        </div>
      </div>

      <div className="content-card">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-grid">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Slide Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter slide title"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>



              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="isActive" className="checkbox-label">
                    Active (Show on website)
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Slide Image {!isEdit && '*'}
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-input-file"
                  />
                  <label htmlFor="image" className="file-upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    Choose Image
                  </label>
                  {errors.image && <span className="error-message">{errors.image}</span>}
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/hero-slider')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {isEdit ? 'Update Slide' : 'Create Slide'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSliderForm;