import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [useCommonDetails, setUseCommonDetails] = useState(false);
  const [commonDetails, setCommonDetails] = useState({
    branch: '',
    year: '',
    sections: '',
    exam_name: '',
    exam_date: '',
    college_name: '',
    course_enrolled: ''
  });
  const [mcqForms, setMcqForms] = useState([{
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: ''
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message

  const API_BASE_URL = 'http://localhost/server';

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get_questions.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setQuestions(data.data);
      else setError(data.error || 'Failed to fetch questions');
    } catch (err) {
      setError(`Failed to fetch questions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCommonDetailsChange = (e) => {
    const { name, value } = e.target;
    setCommonDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedForms = [...mcqForms];
    updatedForms[index] = { ...updatedForms[index], [name]: value };
    setMcqForms(updatedForms);
  };

  const addNewForm = () => {
    setMcqForms([...mcqForms, {
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: ''
    }]);
  };

  const removeForm = (index) => {
    if (mcqForms.length > 1) {
      setMcqForms(mcqForms.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear success message on new submission

    const submissionData = useCommonDetails 
      ? mcqForms.map(form => ({ ...form, ...commonDetails }))
      : mcqForms;

    try {
      const response = await fetch(`${API_BASE_URL}/add_questions.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();
      if (data.success) {
        setMcqForms([{ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: '' }]);
        fetchQuestions();
        setSuccessMessage('Questions added successfully!'); // Optional: Success for adding
      } else {
        setError(data.error || 'Failed to add questions');
      }
    } catch (err) {
      setError(`Failed to add questions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null); // Clear previous success message
      try {
        const response = await fetch(`${API_BASE_URL}/delete_question.php?id=${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          setQuestions(questions.filter(q => q.id !== id));
          setSuccessMessage('Question deleted successfully!'); // Neat acknowledgment
        } else {
          setError(data.error || 'Failed to delete question');
        }
      } catch (err) {
        setError(`Failed to delete question: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - MCQ Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success */}
      {loading && <div className="loading">Loading...</div>}

      <div className="form-container">
        <h2>Add MCQ Questions</h2>
        <form onSubmit={handleSubmit}>
          <div className="common-details-section">
            <label>
              <input
                type="checkbox"
                checked={useCommonDetails}
                onChange={(e) => setUseCommonDetails(e.target.checked)}
              />
              Use Common Details for All Questions
            </label>

            {useCommonDetails && (
              <div className="common-details-form">
                <div className="form-group">
                  <label>Branch (Optional)</label>
                  <input type="text" name="branch" value={commonDetails.branch} onChange={handleCommonDetailsChange} />
                </div>
                <div className="form-group">
                  <label>Year (Optional)</label>
                  <input type="text" name="year" value={commonDetails.year} onChange={handleCommonDetailsChange} />
                </div>
                <div className="form-group">
                  <label>Sections (Optional)</label>
                  <input type="text" name="sections" value={commonDetails.sections} onChange={handleCommonDetailsChange} placeholder="e.g., A,B,C" />
                </div>
                <div className="form-group">
                  <label>Exam Name</label>
                  <input type="text" name="exam_name" value={commonDetails.exam_name} onChange={handleCommonDetailsChange} required />
                </div>
                <div className="form-group">
                  <label>Exam Date</label>
                  <input type="date" name="exam_date" value={commonDetails.exam_date} onChange={handleCommonDetailsChange} required />
                </div>
                <div className="form-group">
                  <label>College Name (Optional)</label>
                  <input type="text" name="college_name" value={commonDetails.college_name} onChange={handleCommonDetailsChange} />
                </div>
                <div className="form-group">
                  <label>Course Enrolled (Optional)</label>
                  <input type="text" name="course_enrolled" value={commonDetails.course_enrolled} onChange={handleCommonDetailsChange} />
                </div>
              </div>
            )}
          </div>

          {mcqForms.map((form, index) => (
            <div key={index} className="mcq-form-section">
              <div className="form-header">
                <h3>Question {index + 1}</h3>
                {mcqForms.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeForm(index)}>Remove</button>
                )}
              </div>
              
              {!useCommonDetails && (
                <div className="form-grid">
                  <div className="form-group"><label>Branch (Optional)</label><input type="text" name="branch" value={form.branch || ''} onChange={(e) => handleInputChange(index, e)} /></div>
                  <div className="form-group"><label>Year (Optional)</label><input type="text" name="year" value={form.year || ''} onChange={(e) => handleInputChange(index, e)} /></div>
                  <div className="form-group"><label>Sections (Optional)</label><input type="text" name="sections" value={form.sections || ''} onChange={(e) => handleInputChange(index, e)} placeholder="e.g., A,B,C" /></div>
                  <div className="form-group"><label>Exam Name</label><input type="text" name="exam_name" value={form.exam_name || ''} onChange={(e) => handleInputChange(index, e)} required /></div>
                  <div className="form-group"><label>Exam Date</label><input type="date" name="exam_date" value={form.exam_date || ''} onChange={(e) => handleInputChange(index, e)} required /></div>
                  <div className="form-group"><label>College Name (Optional)</label><input type="text" name="college_name" value={form.college_name || ''} onChange={(e) => handleInputChange(index, e)} /></div>
                  <div className="form-group"><label>Course Enrolled (Optional)</label><input type="text" name="course_enrolled" value={form.course_enrolled || ''} onChange={(e) => handleInputChange(index, e)} /></div>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group full-width"><label>Question</label><textarea name="question" value={form.question} onChange={(e) => handleInputChange(index, e)} required /></div>
                <div className="form-group"><label>Option A</label><input type="text" name="option_a" value={form.option_a} onChange={(e) => handleInputChange(index, e)} required /></div>
                <div className="form-group"><label>Option B</label><input type="text" name="option_b" value={form.option_b} onChange={(e) => handleInputChange(index, e)} required /></div>
                <div className="form-group"><label>Option C</label><input type="text" name="option_c" value={form.option_c} onChange={(e) => handleInputChange(index, e)} required /></div>
                <div className="form-group"><label>Option D</label><input type="text" name="option_d" value={form.option_d} onChange={(e) => handleInputChange(index, e)} required /></div>
                <div className="form-group">
                  <label>Correct Option</label>
                  <select name="correct_option" value={form.correct_option} onChange={(e) => handleInputChange(index, e)} required>
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <button type="button" className="add-more-btn" onClick={addNewForm}>Add Another Question</button>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Questions'}
            </button>
          </div>
        </form>
      </div>

      <div className="questions-table">
        <h2>Existing Questions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Branch</th><th>Year</th><th>Sections</th><th>Exam Name</th><th>Date</th><th>Question</th><th>Correct</th><th>College</th><th>Course</th><th>Created</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td>{q.id}</td><td>{q.branch || '-'}</td><td>{q.year || '-'}</td><td>{q.sections || '-'}</td><td>{q.exam_name}</td><td>{q.exam_date}</td>
                <td>{q.question.substring(0, 50)}...</td><td>{q.correct_option}</td><td>{q.college_name || '-'}</td><td>{q.course_enrolled || '-'}</td>
                <td>{new Date(q.created_at).toLocaleDateString()}</td>
                <td><button className="delete-btn" onClick={() => handleDelete(q.id)} disabled={loading}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;