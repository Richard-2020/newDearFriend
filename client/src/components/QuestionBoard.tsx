import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import { categories } from '../utils/categories';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Question {
  _id: string;
  text: string;
  category: string;
  createdAt: string;
  answer: string;
  answered: boolean;
}

const QuestionBoard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetchQuestions();
    setFadeIn(true);
    
    // Check for category in URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([decodeURIComponent(categoryParam)]);
    }
  }, [searchParams]);

  const fetchQuestions = async () => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add this line
        },
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Deselect category
        return prev.filter(cat => cat !== category);
      } else {
        // Select category
        return [...prev, category];
      }
    });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
  };

  const filteredQuestions = questions.filter(question => {
    // Only show questions that have been answered
    if (!question.answered) return false;
    
    // If no categories selected, show all answered questions
    if (selectedCategories.length === 0) return true;
    
    // Show questions matching any selected category
    return selectedCategories.includes(question.category);
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
          <Box sx={{ mb: { xs: 4, sm: 6, md: 8 } }}>
            {/* Header Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
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
                  Questions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  View answered questions from our community
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  Home
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/ask')}
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  Ask Question
                </Button>
              </Box>
            </Box>

            {/* Category Grid Filter */}
            <Box sx={{ mb: { xs: 4, sm: 6 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filter by Category
                </Typography>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleResetFilters}
                    sx={{
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                {categories.map((category, index) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <Fade
                      key={category}
                      in={fadeIn}
                      timeout={400 + index * 50}
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      <Card
                        onClick={() => handleCategoryToggle(category)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: isSelected
                            ? '2px solid'
                            : '1px solid rgba(0, 0, 0, 0.06)',
                          borderColor: isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.06)',
                          backgroundColor: isSelected
                            ? 'rgba(0, 102, 204, 0.08)'
                            : 'white',
                          boxShadow: isSelected
                            ? '0px 8px 16px rgba(0, 102, 204, 0.15)'
                            : 'none',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: isSelected
                              ? '0px 12px 24px rgba(0, 102, 204, 0.2)'
                              : '0px 8px 16px rgba(0, 102, 204, 0.1)',
                            borderColor: 'primary.main',
                            backgroundColor: isSelected
                              ? 'rgba(0, 102, 204, 0.12)'
                              : 'rgba(0, 102, 204, 0.04)',
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: { xs: 2, sm: 2.5 },
                            textAlign: 'center',
                            '&:last-child': {
                              pb: { xs: 2, sm: 2.5 },
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: isSelected ? 600 : 500,
                              color: isSelected ? 'primary.main' : 'text.primary',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {category}
                          </Typography>
                          {isSelected && (
                            <Box
                              sx={{
                                mt: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 18,
                                  color: 'primary.main',
                                }}
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Fade>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Questions Grid */}
        {sortedQuestions.length === 0 ? (
          <Fade in={fadeIn} timeout={800}>
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 8, sm: 12 },
                px: 3,
              }}
            >
              <QuestionAnswerIcon
                sx={{
                  fontSize: { xs: 64, sm: 96 },
                  color: 'grey.300',
                  mb: 3,
                }}
              />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No answered questions found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {selectedCategories.length === 0
                  ? 'No questions have been answered yet. Check back later!'
                  : selectedCategories.length === 1
                  ? `No answered questions in the "${selectedCategories[0]}" category yet.`
                  : `No answered questions found in the selected categories.`}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/ask')}
                sx={{
                  borderRadius: 3,
                }}
              >
                Ask a Question
              </Button>
            </Box>
          </Fade>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              },
              gap: { xs: 3, sm: 4, md: 5 },
            }}
          >
            {sortedQuestions.map((question, index) => (
              <Fade
                key={question._id}
                in={fadeIn}
                timeout={600 + index * 100}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0px 20px 40px rgba(0, 102, 204, 0.12)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: { xs: 3, sm: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={question.category}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          backgroundColor: question.answered
                            ? 'rgba(0, 102, 204, 0.1)'
                            : 'rgba(0, 0, 0, 0.06)',
                          color: question.answered ? 'primary.main' : 'text.secondary',
                        }}
                      />
                      {question.answered && (
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          label="Answered"
                          size="small"
                          color="success"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        lineHeight: 1.7,
                        color: 'text.primary',
                        flexGrow: 1,
                      }}
                    >
                      {question.text}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: question.answered ? 3 : 0,
                        fontSize: '0.875rem',
                      }}
                    >
                      {new Date(question.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>

                    {question.answered && (
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 76, 153, 0.05) 100%)',
                            border: '1px solid rgba(0, 102, 204, 0.1)',
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 2,
                              fontWeight: 600,
                              color: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 20 }} />
                            Answer
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.7,
                              color: 'text.primary',
                            }}
                          >
                            {question.answer}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default QuestionBoard;
