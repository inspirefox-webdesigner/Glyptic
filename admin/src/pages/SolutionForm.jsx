import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Toast from '../components/Toast';

const SolutionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (isEdit) {
      fetchSolution();
    }
  }, [id, isEdit]);

  const fetchSolution = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/solutions/${id}`);
      const solution = response.data;
      setTitle(solution.title);
      setContents(solution.contents);
    } catch (error) {
      console.error('Error fetching solution:', error);
    }
  };

  const addContent = (type) => {
    const newContent = {
      type,
      data: type === 'title' ? '' : type === 'image' ? '' : '',
      order: contents.length
    };
    setContents([...contents, newContent]);
  };

  const updateContent = (index, field, value) => {
    const updatedContents = [...contents];
    updatedContents[index][field] = value;
    setContents(updatedContents);
  };

  const removeContent = (index) => {
    const updatedContents = contents.filter((_, i) => i !== index);
    setContents(updatedContents.map((content, i) => ({ ...content, order: i })));
  };

  const moveContent = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= contents.length) return;

    const updatedContents = [...contents];
    [updatedContents[index], updatedContents[newIndex]] = [updatedContents[newIndex], updatedContents[index]];
    updatedContents[index].order = index;
    updatedContents[newIndex].order = newIndex;
    setContents(updatedContents);
  };

  const handleFileUpload = async (file, index) => {
    if (!file) {
      setToast({ show: true, message: 'Please select a file', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const filename = response.data.filename;
      updateContent(index, 'data', filename);
      setUploadedFiles(prev => ({ ...prev, [index]: filename }));
      setToast({ show: true, message: 'File uploaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.error || 'Error uploading file. Please try again.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const solutionData = {
        title,
        contents
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/solutions/${id}`, solutionData);
      } else {
        await axios.post('http://localhost:5000/api/solutions', solutionData);
      }

      setToast({ show: true, message: isEdit ? 'Solution updated successfully!' : 'Solution added successfully!', type: 'success' });
      setTimeout(() => navigate('/solutions'), 1500);
    } catch (error) {
      console.error('Error saving solution:', error);
      const errorMessage = error.response?.data?.message || 'Error saving solution. Please try again.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };
  
  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'list', 'bullet'
  ];

  return (
    <div >
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Solution' : 'Add New Solution'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Solution Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <div className="content-builder">
                {contents.map((content, index) => (
                  <div key={index} className="content-item">
                    <div className="content-item-header">
                      <span className="content-type-badge">{content.type}</span>
                      <div className="content-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => moveContent(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => moveContent(index, 'down')}
                          disabled={index === contents.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeContent(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {content.type === 'title' && (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter title"
                        value={content.data}
                        onChange={(e) => updateContent(index, 'data', e.target.value)}
                      />
                    )}

                    {content.type === 'image' && (
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFileUpload(file, index);
                            }
                          }}
                        />
                        {content.data && (
                          <div className="image-preview">
                            <img 
                              src={`http://localhost:5000/uploads/${content.data}`} 
                              alt="Preview" 
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === 'content' && (
                      <div key={`quill-${index}`}>
                        <ReactQuill
                          theme="snow"
                          value={content.data || ''}
                          onChange={(value) => updateContent(index, 'data', value)}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ backgroundColor: 'white' }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="add-content-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('title')}
                  >
                    Add second Title
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('image')}
                  >
                    Add Image
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('content')}
                  >
                    Add Content
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                type="submit"
                className="btn btn-success"
                
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Solution' : 'Create Solution'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/solutions')}
                style={{ marginLeft: '1rem' }}
                
              >
                Cancel
              </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SolutionForm;