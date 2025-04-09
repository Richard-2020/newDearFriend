import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Question {
  _id: string;
  text: string;
  createdAt: string;
  answer: string;
  answered: boolean;
}

const AdminPanel: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
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

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${selectedQuestion._id}/answer`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer }),
        }
      );

      if (response.ok) {
        setAnswer('');
        setSelectedQuestion(null);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/questions/${questionId}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          fetchQuestions();
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            All Questions
          </Typography>
          {questions.map((question) => (
            <Card key={question._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body1">{question.text}</Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteQuestion(question._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(question.createdAt).toLocaleDateString()}
                </Typography>
                {question.answered && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      Answer:
                    </Typography>
                    <Typography variant="body2">{question.answer}</Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedQuestion(question);
                    setAnswer('');
                  }}
                >
                  {question.answered ? 'Edit Answer' : 'Answer'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          {selectedQuestion ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedQuestion.answered ? 'Edit Answer' : 'Answer Question'}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedQuestion.text}
                </Typography>
                <form onSubmit={handleAnswerSubmit}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Submit Answer
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedQuestion(null);
                        setAnswer('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Select a question to answer
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AdminPanel; 