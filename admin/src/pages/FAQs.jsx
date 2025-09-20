import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faqs');
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setToast({ show: true, message: 'Error fetching FAQs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteFAQ = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/faqs/${id}`);
        setToast({ show: true, message: 'FAQ deleted successfully!', type: 'success' });
        fetchFAQs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        setToast({ show: true, message: 'Error deleting FAQ', type: 'error' });
      }
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      Loading FAQs...
    </div>
  );

  return (
    <div style={{maxWidth: '1400px', margin: '0 auto', padding: '20px'}}>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      
      <div className="page-header">
        <h1 className="page-title">FAQs</h1>
        <Link to="/faqs/new" className="btn btn-primary">
          Add New FAQ Category
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3>No FAQ Categories Found</h3>
            <p>Create your first FAQ category to get started!</p>
            <Link to="/faqs/new" className="btn btn-primary">
              Create First FAQ Category
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ width: '100%', margin: '20px 0' }}>
          <div className="card-body" style={{ padding: '25px' }}>
            <div className="table-responsive" style={{ width: '100%' }}>
              <table className="table table-striped" style={{ width: '100%', color: '#000000', }}>
                <thead>
                  <tr style={{ color: '#000000', backgroundColor: '#f8f9fa' }}>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>No.</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Category Name</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Questions</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Created</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq, index) => (
                    <tr key={faq._id} style={{ color: '#000000' }}>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>{index + 1}</td>
                      <td style={{ padding: '15px 10px', verticalAlign:'middle' }}>
                        <h1 style={{ fontSize: '1.2rem', margin: 0, color: '#000000', fontWeight: '600' }}>
                          {faq.categoryName.length > 30 ? `${faq.categoryName.substring(0, 30)}...` : faq.categoryName}
                        </h1>
                      </td>
                      <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                        <span style={{ 
                          backgroundColor: '#667eea', 
                          color: 'white', 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {faq.questions.length} questions
                        </span>
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Link 
                            to={`/faqs/edit/${faq._id}`} 
                            className="btn btn-secondary btn-sm"
                            style={{ marginBottom: '5px' }}
                          >
                            ✏️ Edit
                          </Link>
                          <button 
                            onClick={() => deleteFAQ(faq._id)}
                            className="btn btn-danger btn-sm"
                            style={{ marginBottom: '5px' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQs;