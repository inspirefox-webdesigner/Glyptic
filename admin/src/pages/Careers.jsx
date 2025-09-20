import { useState, useEffect } from 'react';
import axios from 'axios';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [popupTitle, setPopupTitle] = useState('');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/careers');
      setCareers(response.data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCareer = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`http://localhost:5000/api/careers/${id}`);
        fetchCareers();
      } catch (error) {
        console.error('Error deleting career:', error);
      }
    }
  };

  const handleViewMore = (title, content) => {
    setPopupTitle(title);
    setSelectedContent(content);
  };

  if (loading) {
    return <div className="loading-spinner">Loading Career Applications...</div>;
  }

  const renderWithViewMore = (title, text, limit = 40) => {
    if (!text) return '';
    return text.length > limit ? (
      <>
        {text.substring(0, limit)}...
        <br />
        <button
          onClick={() => handleViewMore(title, text)}
          className="btn btn-link btn-sm"
          style={{
            padding: '2px',
            fontSize: '0.8rem',
            color: '#000',
            backgroundColor: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View More
        </button>
      </>
    ) : (
      text
    );
  };

  return (
    <div style={{maxWidth: '1400px', margin: '0 auto', padding: '20px'}} >
      <div className="page-header">
        <h1 className="page-title" style={{ color: '#000' }}>
          Career Applications
        </h1>
      </div>

      {careers.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3 style={{ color: '#000' }}>No Applications Found</h3>
            <p style={{ color: '#000' }}>No career applications have been submitted yet.</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ width: '100%', margin: '20px 0' }}>
          <div className="card-body" style={{ padding: '25px' }}>
            <div className="table-responsive" style={{ width: '100%' }}>
            <table
              className="table table-striped"
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 10px',
                color: '#000',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>No.</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Name</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Email</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Mobile</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Position</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Qualification</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Specialization</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Experience</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Address</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Applied Date</th>
                  <th style={{ padding: '12px', fontWeight: 'bold' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career, index) => (
                  <tr
                    key={career._id}
                    style={{
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      color: '#000',
                    }}
                  >
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>{index + 1}</td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {renderWithViewMore(
                        'Full Name',
                        `${career.honorific} ${career.fullName}`,
                        25
                      )}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {renderWithViewMore('Email', career.email, 25)}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>{career.mobile}</td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {renderWithViewMore('Position', career.position, 20)}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {renderWithViewMore('Qualification', career.qualification, 20)}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {renderWithViewMore('Specialization', career.specialization, 20)}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>{career.experience}</td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {renderWithViewMore('Address', career.postalAddress, 30)}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {new Date(career.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      <button
                        onClick={() => deleteCareer(career._id)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {selectedContent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedContent(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '600px',
              maxHeight: '400px',
              overflow: 'auto',
              margin: '20px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedContent(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>
            <h4 style={{ marginBottom: '20px', color: '#000' }}>{popupTitle}</h4>
            <div
              style={{ color: '#000', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
            >
              {selectedContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
