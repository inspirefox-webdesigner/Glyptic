import { useState, useEffect } from 'react';
import axios from 'axios';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      Loading Contact Submissions...
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Contact Submissions</h1>
      </div>

      {contacts.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3>No Contacts Found</h3>
            <p>No contact submissions have been received yet.</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ width: '100%', margin: '20px 0' }}>
          <div className="card-body" style={{ padding: '25px' }}>
            <div className="table-responsive" style={{ width: '100%' }}>
              <table className="table table-striped" style={{ width: '100%', color: '#000000' }}>
                <thead>
                  <tr style={{ color: '#000000', backgroundColor: '#f8f9fa' }}>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>No.</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Name</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Email</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Phone</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Subject</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Message</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Date</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, index) => (
                    <tr key={contact._id} style={{ color: '#000000' }}>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>{index + 1}</td>
                      <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                        <div style={{ color: '#000000', fontWeight: '600' }}>
                          {contact.name}
                        </div>
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {contact.email}
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {contact.phone}
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {contact.subject.length > 30 ? `${contact.subject.substring(0, 30)}...` : contact.subject}
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contact.message.length > 50 ? (
                            <>
                              {contact.message.substring(0, 50)}...
                              <br />
                              <button
                                onClick={() => setSelectedMessage(contact.message)}
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
                          ) : contact.message}
                        </div>
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => deleteContact(contact._id)}
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

      {/* Message Popup Modal */}
      {selectedMessage && (
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
            zIndex: 1000
          }}
          onClick={() => setSelectedMessage(null)}
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
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            <h4 style={{ marginBottom: '20px', color: '#333' }}>Full Message</h4>
            <div style={{ color: '#333', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {selectedMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;