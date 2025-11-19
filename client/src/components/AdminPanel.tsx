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
  Fade,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

interface Question {
  _id: string;
  text: string;
  category: string;
  createdAt: string;
  answer: string;
  answered: boolean;
}

const AdminPanel: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetchQuestions();
    setFadeIn(true);
  }, []);

  const fetchQuestions = async () => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/questions/${selectedQuestion._id}/answer`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ answer }),
        }
      );

      if (response.ok) {
        setAnswer('');
        setSelectedQuestion(null);
        fetchQuestions();
      } else if (response.status === 401) {
        // Token expired or invalid
        sessionStorage.removeItem('authToken');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include',
        });

        if (response.ok) {
          if (selectedQuestion?._id === questionId) {
            setSelectedQuestion(null);
            setAnswer('');
          }
          fetchQuestions();
        } else if (response.status === 401) {
          // Token expired or invalid
          sessionStorage.removeItem('authToken');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || '');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Fade in={fadeIn} timeout={600}>
          <Box>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                mb: { xs: 4, sm: 6 },
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    mb: 1,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Admin Panel
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage questions and provide answers
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Back to Home
              </Button>
            </Box>

            {/* Main Content */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 3, md: 4 },
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              {/* Questions List */}
              <Box sx={{ flex: { xs: '1', md: '1' }, minWidth: 0 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                  All Questions ({questions.length})
                </Typography>
                {questions.length === 0 ? (
                  <Card
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No questions yet
                    </Typography>
                  </Card>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {questions.map((question, index) => (
                      <Fade
                        key={question._id}
                        in={fadeIn}
                        timeout={400 + index * 50}
                        style={{ transitionDelay: `${index * 30}ms` }}
                      >
                        <Card
                          sx={{
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            backgroundColor:
                              selectedQuestion?._id === question._id
                                ? 'rgba(0, 102, 204, 0.05)'
                                : 'white',
                            borderColor:
                              selectedQuestion?._id === question._id
                                ? 'primary.main'
                                : 'rgba(0, 0, 0, 0.06)',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0px 12px 24px rgba(0, 102, 204, 0.1)',
                            },
                          }}
                          onClick={() => handleSelectQuestion(question)}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    mb: 1,
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {question.text}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                  <Chip
                                    label={question.category}
                                    size="small"
                                    sx={{
                                      borderRadius: 2,
                                      fontSize: '0.75rem',
                                    }}
                                  />
                                  {question.answered && (
                                    <Chip
                                      icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                      label="Answered"
                                      size="small"
                                      color="success"
                                      sx={{
                                        borderRadius: 2,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(question.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </Typography>
                              </Box>
                              <IconButton
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuestion(question._id);
                                }}
                                sx={{
                                  flexShrink: 0,
                                }}
                                aria-label="Delete question"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            {question.answered && (
                              <Box
                                sx={{
                                  mt: 2,
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: 'rgba(0, 102, 204, 0.05)',
                                  border: '1px solid rgba(0, 102, 204, 0.1)',
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  color="primary"
                                  sx={{ mb: 1, fontWeight: 600 }}
                                >
                                  Answer:
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                  {question.answer}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Fade>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Answer Form */}
              <Box sx={{ flex: { xs: '1', md: '1' }, minWidth: 0 }}>
                {selectedQuestion ? (
                  <Card
                    sx={{
                      position: { md: 'sticky' },
                      top: { md: 24 },
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 3,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedQuestion.answered ? 'Edit Answer' : 'Answer Question'}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            setSelectedQuestion(null);
                            setAnswer('');
                          }}
                          aria-label="Cancel"
                        >
                          <CancelIcon />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 3,
                          bgcolor: 'grey.50',
                          border: '1px solid rgba(0, 0, 0, 0.06)',
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Question:
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {selectedQuestion.text}
                        </Typography>
                      </Box>

                      <form onSubmit={handleAnswerSubmit}>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          variant="outlined"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          required
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={!answer.trim() || isSubmitting}
                            endIcon={<SendIcon />}
                            sx={{
                              flex: 1,
                              borderRadius: 3,
                            }}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSelectedQuestion(null);
                              setAnswer('');
                            }}
                            disabled={isSubmitting}
                            sx={{
                              borderRadius: 3,
                              borderWidth: 2,
                              '&:hover': {
                                borderWidth: 2,
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <EditIcon
                      sx={{
                        fontSize: 64,
                        color: 'grey.300',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Select a question to answer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click on any question from the list to provide or edit an answer
                    </Typography>
                  </Card>
                )}
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AdminPanel;
