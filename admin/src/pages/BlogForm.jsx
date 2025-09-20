import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Toast from '../components/Toast';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id, isEdit]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      const blog = response.data;
      setTitle(blog.title);
      setContents(blog.contents);
    } catch (error) {
      console.error('Error fetching blog:', error);
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
      const blogData = {
        title,
        contents
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/blogs/${id}`, blogData);
      } else {
        await axios.post('http://localhost:5000/api/blogs', blogData);
      }

      setToast({ show: true, message: isEdit ? 'Blog updated successfully!' : 'Blog added successfully!', type: 'success' });
      setTimeout(() => navigate('/blogs'), 1500);
    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMessage = error.response?.data?.message || 'Error saving blog. Please try again.';
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
    <div style={{maxWidth: '1400px', margin: '0 auto', padding: '20px'}}>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Blog' : 'Add New Blog'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Blog Title</label>
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
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/blogs')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;