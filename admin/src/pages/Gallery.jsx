import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
 
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
 
  useEffect(() => {
    fetchImages();
  }, []);
 
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setToast({ show: true, message: 'Error fetching images', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
 
  const deleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`http://localhost:5000/api/gallery/${id}`);
        setImages(images.filter(image => image._id !== id));
        setToast({ show: true, message: 'Image deleted successfully!', type: 'success' });
      } catch (error) {
        console.error('Error deleting image:', error);
        setToast({ show: true, message: 'Error deleting image', type: 'error' });
      }
    }
  };
 
  const handleSelectImage = (id) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };
 
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img._id));
    }
    setSelectAll(!selectAll);
  };
 
  const deleteBulkImages = async () => {
    if (selectedImages.length === 0) return;
   
    if (window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
      try {
        await Promise.all(selectedImages.map(id =>
          axios.delete(`http://localhost:5000/api/gallery/${id}`)
        ));
        setImages(images.filter(image => !selectedImages.includes(image._id)));
        setSelectedImages([]);
        setSelectAll(false);
        setToast({ show: true, message: `${selectedImages.length} images deleted successfully!`, type: 'success' });
      } catch (error) {
        console.error('Error deleting images:', error);
        setToast({ show: true, message: 'Error deleting images', type: 'error' });
      }
    }
  };
 
  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }
 
  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
     
      <div className="page-header d-flex justify-content-between align-items-center">
        <h1 className="page-title mb-0">Gallery</h1>
        <div className="d-flex gap-2" style={{ display: 'flex', alignItems: 'center' }}>
          {selectedImages.length > 0 && (
            <button
              onClick={deleteBulkImages}
              className="btn btn-danger d-flex align-items-center"
              style={{ fontSize: '14px', padding: '8px 16px' , marginRight: '10px' }}
            >
              <i className="fas fa-trash me-2"></i>
              Delete ({selectedImages.length})
            </button>
          )}
          <Link to="/gallery/new" className="btn btn-primary d-flex align-items-center" style={{ fontSize: '14px', padding: '8px 16px' }}>
            <i className="fas fa-plus me-2"></i>
            Add Images
          </Link>
        </div>
      </div>
 
      <div className="card">
        <div className="card-body">
          {images.length === 0 ? (
            <div className="empty-state">
              <p>No images found. <Link to="/gallery/new">Upload your first images</Link></p>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <div className="form-check" style={{marginBottom: '10px'}}>
                  <input
                  style={{color: '#fff'}}
                    type="checkbox"
                    className="form-check-input"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="selectAll" style={{color: '#333' , paddingLeft: '8px', }}>
                    Select All Images
                  </label>
                </div>
                
                {/* {selectedImages.length > 0 && (
                  <span className="badge bg-primary fs-6" style={{ padding: '10px 20px', color: '#333', marginBottom: '10px' }}>
                    {selectedImages.length} selected
                  </span>
                )} */}
              </div>
              <div
                className="gallery-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '20px',
                  width: '100%',
                  overflowY: 'auto',
                }}
              >
                {images.map((image) => (
                  <div
                    key={image._id}
                    className={`gallery-item-admin position-relative border rounded overflow-hidden shadow-sm ${
                      selectedImages.includes(image._id) ? 'border-primary border-3' : 'border-light'
                    }`}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 2 }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        style={{
                          width: '18px',
                          height: '18px',
                          backgroundColor: selectedImages.includes(image._id) ? '#0d6efd' : 'white',
                          borderColor: selectedImages.includes(image._id) ? '#0d6efd' : '#dee2e6'
                        }}
                        checked={selectedImages.includes(image._id)}
                        onChange={() => handleSelectImage(image._id)}
                      />
                    </div>
                    <img
                      src={`http://localhost:5000/uploads/${image.filename}`}
                      alt="Gallery"
                      className="w-100"
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectImage(image._id)}
                    />
                    <div className="p-2 bg-white">
                      <button
                        onClick={() => deleteImage(image._id)}
                        className="btn btn-sm btn-danger w-100 d-flex align-items-center justify-content-center"
                        style={{ fontSize: '12px' , margin: '10px'}}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Gallery;