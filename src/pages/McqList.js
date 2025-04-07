import React, { useState, useEffect } from 'react';
import axios from 'axios';

const McqList = () => {
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    sections: '',
    college_name: '',
    course_enrolled: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMcqQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost/server/get_mcq_questions.php', {
        params: filters
      });
      console.log('Response:', response.data); // Log the response
      if (response.data.success) {
        setMcqQuestions(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch MCQ questions');
      }
    } catch (err) {
      console.error('Error:', err); // Log the error details
      setError('An error occurred while fetching data: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMcqQuestions();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>MCQ Questions</h2>
      <div>
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={filters.branch}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={filters.year}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="sections"
          placeholder="Sections"
          value={filters.sections}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="college_name"
          placeholder="College Name"
          value={filters.college_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="course_enrolled"
          placeholder="Course Enrolled"
          value={filters.course_enrolled}
          onChange={handleFilterChange}
        />
        <button onClick={fetchMcqQuestions}>Apply Filters</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {mcqQuestions.map((question) => (
          <li key={question.id}>
            <strong>{question.question}</strong>
            <ul>
              <li>A: {question.option_a}</li>
              <li>B: {question.option_b}</li>
              <li>C: {question.option_c}</li>
              <li>D: {question.option_d}</li>
              <li>Correct: {question.correct_option}</li>
            </ul>
            <p>Branch: {question.branch}</p>
            <p>Year: {question.year}</p>
            <p>Section: {question.sections}</p>
            <p>College: {question.college_name}</p>
            <p>Course: {question.course_enrolled}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default McqList;