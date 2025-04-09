import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './QuestionBoard.css';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

interface Question {
  _id: string;
  text: string;
  createdAt: string;
  answer: string;
  answered: boolean;
}

const QuestionBoard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="question-board">
      <div className="header">
        <h2>Questions</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Link to="/ask" className="ask-button">Ask a Question</Link>
        </div>
      </div>
      <div className="questions-list">
        {questions.map((question) => (
          <div key={question._id} className="question-card">
            <p className="question-text">{question.text}</p>
            <p className="question-date">
              {new Date(question.createdAt).toLocaleDateString()}
            </p>
            {question.answered && (
              <div className="answer">
                <h4>Answer:</h4>
                <p>{question.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBoard; 