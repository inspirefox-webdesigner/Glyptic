import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';

const FAQForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categoryName, setCategoryName] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const predefinedCategories = [
    'Fire Detection & Alarm System',
    'Public Address System', 
    'CCTV System'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchFAQ();
    }
  }, [id, isEdit]);

  const fetchFAQ = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/faqs/${id}`);
      const faq = response.data;
      setCategoryName(faq.categoryName);
      setQuestions(faq.questions);
      
      // Check if it's a custom category
      const isCustom = !predefinedCategories.includes(faq.categoryName);
      setIsCustomCategory(isCustom);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      setToast({ show: true, message: 'Error fetching FAQ', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const faqData = {
        categoryName,
        questions: questions.map((q, index) => ({ ...q, order: index }))
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/faqs/${id}`, faqData);
      } else {
        await axios.post('http://localhost:5000/api/faqs', faqData);
      }

      setToast({ 
        show: true, 
        message: isEdit ? 'FAQ updated successfully!' : 'FAQ created successfully!', 
        type: 'success' 
      });
      setTimeout(() => navigate('/faqs'), 1500);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      const errorMessage = error.response?.data?.message || 'Error saving FAQ. Please try again.';
      setToast({ show: true, message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      answer: '',
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions.map((question, i) => ({ ...question, order: i })));
  };

  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const updatedQuestions = [...questions];
    [updatedQuestions[index], updatedQuestions[newIndex]] = [updatedQuestions[newIndex], updatedQuestions[index]];
    updatedQuestions[index].order = index;
    updatedQuestions[newIndex].order = newIndex;
    setQuestions(updatedQuestions);
  };

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
          {isEdit ? 'Edit FAQ Category' : 'Add New FAQ Category'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' , color: '#000000' }}>
                  <input
                    type="radio"
                    name="categoryType"
                    checked={!isCustomCategory}
                    onChange={() => {
                      setIsCustomCategory(false);
                      setCategoryName('');
                    }}
                  />
                  Select from existing categories
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' , color: '#000000' }}>
                  <input
                    type="radio"
                    name="categoryType"
                    checked={isCustomCategory}
                    onChange={() => {
                      setIsCustomCategory(true);
                      setCategoryName('');
                    }}
                  />
                  Add new category
                </label>
              </div>
              
              {!isCustomCategory ? (
                <select
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {predefinedCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Questions & Answers</label>
              <div className="questions-builder">
                {questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <div className="question-item-header">
                      <span className="question-number">Question {index + 1}</span>
                      <div className="question-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ marginLeft: '1rem' }}
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ marginLeft: '3rem' }}
                          onClick={() => removeQuestion(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Question</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Answer</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter the answer"
                        value={question.answer}
                        onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}

                <div className="add-question-button">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addQuestion}
                  >
                    ➕ Add Question
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
                {loading ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/faqs')}
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

export default FAQForm;