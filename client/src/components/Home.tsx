import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AdminPanelIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Question {
  _id: string;
  text: string;
  category: string;
  createdAt: string;
  answer: string;
  answered: boolean;
}

// Main categories to display on homepage
const mainCategories = [
  { name: 'Other', color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.1)' },
  { name: 'Children', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { name: 'Spousal relationship', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.1)' },
  { name: 'Faith', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
];

function Home() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setFadeIn(true);
    fetchRecentQuestions();
  }, []);

  const fetchRecentQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      // Filter for answered questions, sort by date (newest first), limit to 5
      const answered = data
        .filter((q: Question) => q.answered)
        .sort((a: Question, b: Question) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      setRecentQuestions(answered);
    } catch (error) {
      console.error('Error fetching recent questions:', error);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to board with category filter
    navigate(`/board?category=${encodeURIComponent(categoryName)}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header with Admin Login */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outlined"
              size="medium"
              onClick={() => navigate('/login')}
              startIcon={<AdminPanelIcon />}
              sx={{
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Admin Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 8, sm: 12, md: 16 },
          pb: { xs: 8, sm: 12, md: 16 },
          px: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <Fade in={fadeIn} timeout={800}>
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '900px',
              mx: 'auto',
              mb: { xs: 8, sm: 10, md: 12 },
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: { xs: 3, sm: 4 },
                background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              DearFriend
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 2,
                color: 'text.secondary',
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              You've got questions, we've got answers.
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mb: 3,
                color: 'text.secondary',
                fontWeight: 300,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Our team reviews every question and responds personally with care.
            </Typography>
            
            {/* Anonymous Assurance */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: { xs: 4, sm: 5 },
                p: 2,
                borderRadius: 3,
                backgroundColor: 'rgba(0, 102, 204, 0.05)',
                border: '1px solid rgba(0, 102, 204, 0.1)',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              <SecurityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Ask anything anonymously—your identity is safe with us.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: { xs: 6, sm: 8 },
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/ask')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: { xs: 5, sm: 6 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderRadius: 3,
                  fontWeight: 600,
                  boxShadow: '0px 4px 12px rgba(0, 102, 204, 0.3)',
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(0, 102, 204, 0.4)',
                  },
                }}
              >
                Ask a Question Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/board')}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                View Questions
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Category Grid */}
        <Fade in={fadeIn} timeout={1000}>
          <Box sx={{ mb: { xs: 6, sm: 8, md: 10 } }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Browse by Category
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, sm: 3, md: 4 },
                maxWidth: '1000px',
                mx: 'auto',
              }}
            >
              {mainCategories.map((category, index) => (
                <Fade
                  key={category.name}
                  in={fadeIn}
                  timeout={600 + index * 100}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card
                    onClick={() => handleCategoryClick(category.name)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      backgroundColor: category.bgColor,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0px 12px 24px ${category.color}40`,
                        borderColor: category.color,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 3, sm: 4 },
                        textAlign: 'center',
                        minHeight: { xs: '120px', sm: '140px' },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: category.color,
                          mb: 1,
                        }}
                      >
                        {category.name}
                      </Typography>
                      <ArrowForwardIcon
                        sx={{
                          color: category.color,
                          fontSize: 20,
                          mt: 1,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Recent Questions Section */}
        {recentQuestions.length > 0 && (
          <Fade in={fadeIn} timeout={1200}>
            <Box sx={{ mb: { xs: 6, sm: 8, md: 10 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  Recent Questions
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/board')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  See More
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: { xs: 3, sm: 4 },
                }}
              >
                {recentQuestions.slice(0, 3).map((question, index) => (
                  <Fade
                    key={question._id}
                    in={fadeIn}
                    timeout={800 + index * 100}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0px 12px 24px rgba(0, 102, 204, 0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: { xs: 3, sm: 4 } }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            label={question.category}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 500,
                              backgroundColor: 'rgba(0, 102, 204, 0.1)',
                              color: 'primary.main',
                            }}
                          />
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                            label="Answered"
                            size="small"
                            color="success"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 2,
                            fontWeight: 500,
                            lineHeight: 1.6,
                            color: 'text.primary',
                          }}
                        >
                          {truncateText(question.text, 120)}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            color: 'text.secondary',
                          }}
                        >
                          {truncateText(question.answer, 100)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {/* How It Works Section */}
        <Fade in={fadeIn} timeout={1400}>
          <Box
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1) 0%, rgba(0, 76, 153, 0.1) 100%)',
              }}
            >
              <InfoIcon
                sx={{
                  fontSize: { xs: 40, sm: 48 },
                  color: 'primary.main',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                lineHeight: 1.8,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Simply submit your question anonymously through our secure platform. Our dedicated team
              reviews each question carefully and provides thoughtful, personalized responses. Once
              answered, your question and response are shared on our board to help others with similar questions.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Home; 