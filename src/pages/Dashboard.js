import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showAnswers, setShowAnswers] = useState(false); // New state to control answer visibility

  useEffect(() => {
    const fetchMcqQuestions = async () => {
      try {
        const url = user?.enrolled_courses
          ? `http://localhost/server/get_mcq_questions.php?enrolled_courses=${encodeURIComponent(user.enrolled_courses)}&user_id=${user.login_id}`
          : `http://localhost/server/get_mcq_questions.php?user_id=${user.login_id}`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        if (!text) throw new Error('Empty response from server');
        
        const data = JSON.parse(text);
        if (data.success) {
          setMcqQuestions(data.questions);
          const attemptData = data.attempts.reduce((acc, attempt) => {
            acc[attempt.question_id] = { selected_option: attempt.selected_option, attempt_number: attempt.attempt_number };
            return acc;
          }, {});
          setAttempts(attemptData);
          const maxAttempt = Math.max(...data.attempts.map(a => a.attempt_number), 0);
          setAttemptNumber(maxAttempt + 1);
        } else {
          setError(data.message || 'Unknown error occurred');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMcqQuestions();
  }, [user]);

  const handleAnswerSubmit = async (questionId, selectedOption) => {
    try {
      const response = await fetch('http://localhost/server/get_mcq_questions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.login_id,
          question_id: questionId,
          selected_option: selectedOption,
          attempt_number: attemptNumber,
        }),
      });
      
      const text = await response.text();
      if (!text) throw new Error('Empty response from server');
      
      const data = JSON.parse(text);
      if (data.success) {
        setAttempts((prev) => ({
          ...prev,
          [questionId]: { selected_option: selectedOption, attempt_number: attemptNumber },
        }));
      } else {
        throw new Error(data.message || 'Failed to submit answer');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting answer: ' + err.message);
    }
  };

  const calculateAndSaveResults = async () => {
    try {
      let correct = 0;
      const total = mcqQuestions.length;
      
      mcqQuestions.forEach((q) => {
        if (attempts[q.id]?.selected_option === q.correct_option) correct++;
      });

      const score = correct;
      const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
      
      const resultData = {
        user_id: user.login_id,
        exam_name: mcqQuestions[0]?.exam_name || 'General Assessment',
        score,
        total_questions: total,
        percentage,
        attempt_number: attemptNumber,
      };

      const response = await fetch('http://localhost/server/get_mcq_questions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });

      const text = await response.text();
      if (!text) throw new Error('Server returned empty response');
      
      const data = JSON.parse(text);
      if (!data.success) throw new Error(data.message || 'Failed to save results');
      
      setResults({ correct, total, percentage, score });
      setShowAnswers(true); // Show answers after results are saved
      if (percentage < 70) {
        alert(`Warning: Your score (${percentage}%) is below 70%. Consider reviewing the material and attempting again.`);
      } else {
        alert('Results saved successfully!');
      }
    } catch (err) {
      console.error('Results error:', err);
      alert('Error saving results: ' + err.message);
    }
  };

  const startNewAttempt = () => {
    setAttempts({});
    setResults(null);
    setShowAnswers(false); // Hide answers for new attempt
    setAttemptNumber((prev) => prev + 1);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

      <div className="profile-card">
        <h2>Personal Information</h2>
        <p><strong>Name:</strong> {user?.full_name || 'N/A'}</p>
        <p><strong>Login ID:</strong> {user?.login_id || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>College:</strong> {user?.college_name || 'N/A'}</p>
      </div>

      <div className="academic-info">
        <h2>Academic Details</h2>
        <p><strong>Year:</strong> {user?.year || 'N/A'}</p>
        <p><strong>Branch:</strong> {user?.branch || 'N/A'}</p>
        <p><strong>Section:</strong> {user?.section || 'N/A'}</p>
        <p><strong>Degree Type:</strong> {user?.degree_type || 'N/A'}</p>
        {user?.other_degree && <p><strong>Other Degree:</strong> {user?.other_degree}</p>}
        <p><strong>Enrolled Courses:</strong> {user?.enrolled_courses || 'N/A'}</p>
      </div>

      <div className="exam-section">
        <h2>Available Exams - Attempt #{attemptNumber}</h2>
        {mcqQuestions.length > 0 ? (
          <>
            <ul className="questions-list">
              {mcqQuestions.map((question) => (
                <li key={question.id} className="question-item">
                  <strong>{question.exam_name} - {question.exam_date}</strong><br />
                  <p>{question.question}</p>
                  <ul className="options-list">
                    {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, idx) => (
                      <li key={opt} className="option-item">
                        <label>
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value={String.fromCharCode(65 + idx)}
                            checked={attempts[question.id]?.selected_option === String.fromCharCode(65 + idx)}
                            onChange={() => handleAnswerSubmit(question.id, String.fromCharCode(65 + idx))}
                            disabled={showAnswers} // Disable inputs after answers are shown
                          />
                          {String.fromCharCode(65 + idx)}: {question[opt]}
                        </label>
                        {showAnswers && question.correct_option === String.fromCharCode(65 + idx) && (
                          <span style={{ color: 'green', marginLeft: '10px' }}>✓ Correct</span>
                        )}
                        {showAnswers && attempts[question.id]?.selected_option === String.fromCharCode(65 + idx) && 
                          attempts[question.id]?.selected_option !== question.correct_option && (
                          <span style={{ color: 'red', marginLeft: '10px' }}>✗ Your Answer</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {showAnswers && (
                    <p className="answer-feedback">
                      <em>Your Answer: {attempts[question.id]?.selected_option || 'Not answered'}</em> |{' '}
                      <em>Correct Answer: {question.correct_option}</em>
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="submit-results"
              onClick={calculateAndSaveResults}
              disabled={Object.keys(attempts).length !== mcqQuestions.length || showAnswers}
            >
              View and Save Results
            </button>
            <button
              className="new-attempt"
              onClick={startNewAttempt}
              disabled={Object.keys(attempts).length === 0}
            >
              Start New Attempt
            </button>
            {results && (
              <div className="results">
                <h3>Results for Attempt #{attemptNumber - 1}</h3>
                <p>Score: {results.score}/{results.total}</p>
                <p>Correct Answers: {results.correct}/{results.total}</p>
                <p>Percentage: {results.percentage}%</p>
              </div>
            )}
          </>
        ) : (
          <p className="no-exams">No exams available for your enrolled courses.</p>
        )}
      </div>
    </div>
  );
}