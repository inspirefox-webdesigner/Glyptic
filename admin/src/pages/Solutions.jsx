import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/solutions');
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSolution = async (id) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await axios.delete(`http://localhost:5000/api/solutions/${id}`);
        fetchSolutions();
      } catch (error) {
        console.error('Error deleting solution:', error);
      }
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      Loading Solutions...
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Solutions</h1>
        <Link to="/solutions/new" className="btn btn-primary">
          Add New Solution
        </Link>
      </div>

      {solutions.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <h3>No Solutions Found</h3>
            <p>Create your first solution to get started!</p>
            <Link to="/solutions/new" className="btn btn-primary">
              Create First Solution
            </Link>
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
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Title</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Image</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Content</th>
                    <th style={{ color: '#000000', padding: '15px 10px', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((solution, index) => {
                    const firstImage = solution.contents.find(c => c.type === 'image');
                    const contentText = solution.contents
                      .filter(c => c.type === 'content')
                      .map(c => c.data.replace(/<[^>]*>/g, ''))
                      .join(' ');
                    
                    return (
                      <tr key={solution._id} style={{ color: '#000000' }}>
                        <td style={{ color: '#000000', padding: '15px 10px', verticalAlign: 'middle' }}>{index + 1}</td>
                        <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                          <h1 style={{ fontSize: '1.2rem', margin: 0, color: '#000000', fontWeight: '600' }}>
                            {solution.title.length > 30 ? `${solution.title.substring(0, 30)}...` : solution.title}
                          </h1>
                        </td>
                        <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                          {firstImage ? (
                            <img 
                              src={`http://localhost:5000/uploads/${firstImage.data}`}
                              alt="Solution"
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <span style={{ color: '#000000' }}>No Image</span>
                          )}
                        </td>
                        <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                          <div style={{ maxWidth: '300px', color: '#000000', lineHeight: '1.4',overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {contentText.length > 80 ? `${contentText.substring(0, 80)}...` : contentText || 'No content'}
                          </div>
                        </td>
                        <td style={{ padding: '15px 10px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Link 
                              to={`/solutions/edit/${solution._id}`} 
                              className="btn btn-secondary btn-sm"
                              style={{ marginBottom: '5px' }}
                            >
                              ✏️ Edit
                            </Link>
                            <button 
                              onClick={() => deleteSolution(solution._id)}
                              className="btn btn-danger btn-sm"
                              style={{ marginBottom: '5px' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;