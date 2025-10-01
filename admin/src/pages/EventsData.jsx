import { useState, useEffect } from 'react';
import axios from 'axios';

const EventsData = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/training/registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const deleteRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await axios.delete(`http://localhost:5000/api/training/registrations/${registrationId}`);
        fetchRegistrations();
      } catch (error) {
        console.error('Error deleting registration:', error);
        alert('Failed to delete registration');
      }
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      Loading Event Registrations...
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Event Registrations</h1>
      </div>

      {registrations.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3>No Registrations Found</h3>
            <p>No users have registered for events yet.</p>
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
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Event</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Event Date</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Name</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Phone</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Email</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Address</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Registered</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration._id} style={{ color: '#000000' }}>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                        <div style={{ color: '#000000', fontWeight: '600' }}>
                          {registration.eventTitle.length > 30 
                            ? `${registration.eventTitle.substring(0, 30)}...` 
                            : registration.eventTitle}
                        </div>
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {formatDate(registration.eventDate)}
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {registration.name}
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {registration.phone}
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {registration.email}
                      </td>
                      <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                        <div style={{ maxWidth: '200px', color: '#000000', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {registration.address.length > 50 
                            ? `${registration.address.substring(0, 50)}...` 
                            : registration.address}
                        </div>
                      </td>
                      <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>
                        {formatDate(registration.registeredAt)}
                      </td>
                      <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteRegistration(registration._id)}
                          style={{
                            backgroundColor: '#dc3545',
                            borderColor: '#dc3545',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: '4px'
                          }}
                        >
                          Delete
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
    </div>
  );
};

export default EventsData;