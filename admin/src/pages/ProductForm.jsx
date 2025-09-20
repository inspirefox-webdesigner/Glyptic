import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import './ProductForm.css';
import Toast from '../components/Toast';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('fire-alarm');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const predefinedCategories = [
    { value: 'fire-alarm', label: 'Fire Alarm System' },
    { value: 'other-products', label: 'Other Products' },
    { value: 'fire-suppression', label: 'Fire Suppression System' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const product = response.data;
      setTitle(product.title);
      setCategory(product.category);
      setContents(product.contents);

      // Check if it's a custom category
      const isCustom = !predefinedCategories.some(cat => cat.value === product.category);
      setIsCustomCategory(isCustom);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        title,
        category,
        contents
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/products/${id}`, productData);
      } else {
        await axios.post('http://localhost:5000/api/products', productData);
      }

      setToast({ show: true, message: isEdit ? 'Product updated successfully!' : 'Product created successfully!', type: 'success' });
      setTimeout(() => navigate('/products'), 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Error saving product. Please try again.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addContent = (type) => {
    const newContent = {
      type,
      data: type === 'title' ? '' : type === 'image' ? '' : type === 'video' ? '' : '',
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
      // Ensure subType is preserved for specification images
      if (contents[index].type === 'specification' && contents[index].subType === 'image') {
        updateContent(index, 'subType', 'image');
      }
      setUploadedFiles(prev => ({ ...prev, [index]: filename }));
      setToast({ show: true, message: 'File uploaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.error || 'Error uploading file. Please try again.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    }
  };

  const handleMultipleFileUpload = async (files, index) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.filename;
    });

    try {
      const filenames = await Promise.all(uploadPromises);
      const currentData = contents[index].data;
      const existingImages = Array.isArray(currentData) ? currentData : (currentData ? [currentData] : []);
      updateContent(index, 'data', [...existingImages, ...filenames]);
      setToast({ show: true, message: `${filenames.length} images uploaded successfully!`, type: 'success' });
    } catch (error) {
      console.error('Error uploading files:', error);
      setToast({ show: true, message: 'Error uploading images', type: 'error' });
    }
  };

  const removeImage = (contentIndex, imageIndex) => {
    const currentData = contents[contentIndex].data;
    const images = Array.isArray(currentData) ? currentData : [currentData];
    const updatedImages = images.filter((_, i) => i !== imageIndex);
    updateContent(contentIndex, 'data', updatedImages.length === 1 ? updatedImages[0] : updatedImages);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Product Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#000000' }}>
                  <input
                    type="radio"
                    name="categoryType"
                    checked={!isCustomCategory}
                    onChange={() => {
                      setIsCustomCategory(false);
                      setCategory('fire-alarm');
                    }}
                  />
                  Select from existing categories
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000000' }}>
                  <input
                    type="radio"
                    name="categoryType"
                    checked={isCustomCategory}
                    onChange={() => {
                      setIsCustomCategory(true);
                      setCategory('');
                    }}
                  />
                  Add new category
                </label>
              </div>

              {!isCustomCategory ? (
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {predefinedCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter new category name"
                  required
                />
              )}
            </div>



            <div className="form-group">
              <label className="form-label">Content</label>
              <div className="content-builder">
                {contents.map((content, index) => (
                  <div key={index} className="content-item">
                    <div className="content-item-header">
                      <span className="content-type-badge">
                        {content.type === 'specification' ?
                          `${content.type} (${content.subType || 'text'})` :
                          content.type === 'image' ? 'Product Image' :
                          content.type === 'table' ? 'Tech Specification Table' :
                          content.type
                        }
                      </span>
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
                        onKeyDown={handleKeyDown}
                      />
                    )}

                    {content.type === 'image' && (
                      <div>
                        <input
                          type="file"
                          className="form-control mb-2"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              handleMultipleFileUpload(files, index);
                            }
                          }}
                        />
                        {content.data && (
                          <div className="image-preview-grid">
                            {(Array.isArray(content.data) ? content.data : [content.data]).map((filename, imgIndex) => (
                              <div key={imgIndex} className="image-preview-item">
                                <img
                                  src={`http://localhost:5000/uploads/${filename}`}
                                  alt={`Preview ${imgIndex + 1}`}
                                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: 'none' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger remove-image-btn"
                                  onClick={() => removeImage(index, imgIndex)}
                                  style={{ position: 'absolute', top: '5px', right: '5px', padding: '2px 6px' }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
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

                    {content.type === 'specification' && (
                      <div>
                        {content.subType === 'text' ? (
                          <ReactQuill
                            theme="snow"
                            value={content.data || ''}
                            onChange={(value) => updateContent(index, 'data', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ backgroundColor: 'white' }}
                            placeholder="Enter specification text..."
                          />
                        ) : (
                          <div>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleFileUpload(file, index);
                                }
                              }}
                            />
                            {content.data && (
                              <div className="mt-2 p-2 bg-light rounded">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="fas fa-image text-primary"></i>
                                  <span className="text-muted"> Image: {content.data}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === 'video' && (
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          accept="video/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                const response = await axios.post('http://localhost:5000/api/upload', formData);
                                updateContent(index, 'data', 'uploads/' + response.data.filename);
                                setToast({ show: true, message: 'Video uploaded successfully!', type: 'success' });
                              } catch (error) {
                                setToast({ show: true, message: 'Error uploading video', type: 'error' });
                              }
                            }
                          }}
                        />
                        {content.data && content.data.startsWith('uploads/') && (
                          <div className="mt-2">
                            <video controls style={{ width: '100%', maxWidth: '300px' }}>
                              <source src={`http://localhost:5000/${content.data}`} />
                            </video>
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === 'techSpecifications' && (
                      <div>
                        <ReactQuill
                          theme="snow"
                          value={content.data || ''}
                          onChange={(value) => updateContent(index, 'data', value)}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['link'],
                              [{ 'align': [] }],
                              ['blockquote'],
                              ['clean']
                            ],
                          }}
                          formats={[
                            'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'align', 'blockquote'
                          ]}
                          style={{ backgroundColor: 'white', marginBottom: '1rem' }}
                          placeholder="Enter technical specifications..."
                        />

                      </div>
                    )}

                    {content.type === 'table' && (
                      <div>
                        <div className="mb-3">
                          <div className="d-flex gap-2 mb-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                const tableData = content.data || { rows: [['']], headers: [''] };
                                tableData.headers.push('');
                                tableData.rows = tableData.rows.map(row => [...row, '']);
                                updateContent(index, 'data', tableData);
                              }}
                            >
                              Add Column
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              style={{ marginLeft: '1rem' , marginBottom: '1rem' }}
                              onClick={() => {
                                const tableData = content.data || { rows: [['']], headers: [''] };
                                const newRow = new Array(tableData.headers.length).fill('');
                                tableData.rows.push(newRow);
                                updateContent(index, 'data', tableData);
                              }}
                            >
                              Add Row
                            </button>
                          </div>

                          {content.data && (
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    {content.data.headers.map((header, headerIndex) => (
                                      <th key={headerIndex}>
                                        <input
                                          type="text"
                                          className="form-control"
                                          value={header}
                                          placeholder={`Header ${headerIndex + 1}`}
                                          onChange={(e) => {
                                            const tableData = { ...content.data };
                                            tableData.headers[headerIndex] = e.target.value;
                                            updateContent(index, 'data', tableData);
                                          }}
                                          onKeyDown={handleKeyDown}
                                        />
                                      </th>
                                    ))}
                                    <th width="50">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                          if (content.data.headers.length > 1) {
                                            const tableData = { ...content.data };
                                            tableData.headers.pop();
                                            tableData.rows = tableData.rows.map(row => row.slice(0, -1));
                                            updateContent(index, 'data', tableData);
                                          }
                                        }}
                                      >
                                        -
                                      </button>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {content.data.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={cell}
                                            onChange={(e) => {
                                              const tableData = { ...content.data };
                                              tableData.rows[rowIndex][cellIndex] = e.target.value;
                                              updateContent(index, 'data', tableData);
                                            }}
                                            onKeyDown={handleKeyDown}
                                          />
                                        </td>
                                      ))}
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger"
                                          onClick={() => {
                                            if (content.data.rows.length > 1) {
                                              const tableData = { ...content.data };
                                              tableData.rows.splice(rowIndex, 1);
                                              updateContent(index, 'data', tableData);
                                            }
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {!content.data && (
                            <div className="text-center p-3 border rounded">
                              <p className="mb-2">Click "Add Column" or "Add Row" to start creating your table</p>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  updateContent(index, 'data', {
                                    headers: ['Column 1', 'Column 2'],
                                    rows: [['', '']]
                                  });
                                }}
                              >
                                Create Table
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {content.type === 'manualDownload' && (
                      <div>
                        <div className="mb-2">
                          <label className="form-label">PDF URL</label>
                          <input
                            type="url"
                            className="form-control mb-2"
                            value={content.data && !content.data.startsWith('uploads/') ? content.data : ''}
                            onChange={(e) => updateContent(index, 'data', e.target.value)}

                            placeholder="Enter PDF URL (e.g., https://example.com/manual.pdf)"
                          />
                          <div className="text-center my-3">
                            <span className="badge bg-secondary">OR</span>
                          </div>
                          <label className="form-label">Upload PDF File</label>
                          <input
                            type="file"
                            className="form-control"
                            accept=".pdf,application/pdf"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Validate file type
                                if (file.type !== 'application/pdf') {
                                  setToast({ show: true, message: 'Please select a PDF file only', type: 'error' });
                                  e.target.value = '';
                                  return;
                                }

                                // Validate file size (max 10MB)
                                if (file.size > 10 * 1024 * 1024) {
                                  setToast({ show: true, message: 'PDF file size should be less than 10MB', type: 'error' });
                                  e.target.value = '';
                                  return;
                                }

                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                  const response = await axios.post('http://localhost:5000/api/upload', formData);
                                  updateContent(index, 'data', 'uploads/' + response.data.filename);
                                  setToast({ show: true, message: 'PDF uploaded successfully!', type: 'success' });
                                } catch (error) {
                                  setToast({ show: true, message: 'Error uploading PDF', type: 'error' });
                                }
                              }
                            }}
                          />
                          {content.data && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-file-pdf text-danger" style={{ fontSize: '1.5rem' }}></i>
                                <div>
                                  <strong>PDF Manual:</strong>
                                  <br />
                                  <small className="text-muted">
                                    {content.data.startsWith('uploads/')
                                      ? content.data.replace('uploads/', '').replace(/^\d+-\d+-/, '')
                                      : content.data
                                    }
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
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
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        const newContent = {
                          type: 'specification',
                          subType: 'text',
                          data: '',
                          order: contents.length
                        };
                        setContents([...contents, newContent]);
                      }}
                    >
                      Add Spec Text
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginLeft: '1rem' }}
                      onClick={() => {
                        const newContent = {
                          type: 'specification',
                          subType: 'image',
                          data: '',
                          order: contents.length
                        };
                        setContents([...contents, newContent]);
                      }}
                    >
                      Add Spec Image
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('video')}
                  >
                    Add Video
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('techSpecifications')}
                  >
                    Add Tech Specifications
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('table')}
                  >
                    Add Teach Specifications Table
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addContent('manualDownload')}
                  >
                    <i className="fas fa-file-pdf me-1"></i>
                    Add Manual Download
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
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
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

export default ProductForm;