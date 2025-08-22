import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
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

const allCategories = ['All', 'Unanswered', ...categories];

const QuestionBoard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions`);
      const data = await response.json();
      console.log('Fetched questions:', data); // Debug log
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    console.log('Selected category:', newCategory); // Debug log
    setSelectedCategory(newCategory);
  };

  const filteredQuestions = questions.filter(question => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Unanswered') return !question.answered;
    
    // Debug logs for category matching
    console.log('Question category:', question.category);
    console.log('Selected category:', selectedCategory);
    console.log('Match:', question.category === selectedCategory);
    
    return question.category === selectedCategory;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4, lg: 5 },
        px: { xs: 2, sm: 3, md: 4, lg: 6 }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: { xs: 2, sm: 3, md: 4, lg: 5 }
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          <Typography 
            variant={isMobile ? "h5" : isDesktop ? "h3" : "h4"} 
            component="h1"
            sx={{ 
              textAlign: { xs: 'center', sm: 'left' },
              fontWeight: 600
            }}
          >
            Questions
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: { xs: 'center', sm: 'flex-end' }
          }}>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              size={isMobile ? "small" : "large"}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              startIcon={<QuestionAnswerIcon />}
              onClick={() => navigate('/ask')}
              size={isMobile ? "small" : "large"}
            >
              Ask a Question
            </Button>
          </Box>
        </Box>

        {/* Category Filter */}
        <Box sx={{ 
          maxWidth: { xs: '100%', sm: '50%', md: '40%', lg: '30%' },
          mx: { xs: 'auto', sm: 0 }
        }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
              size={isMobile ? "small" : "medium"}
            >
              {allCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Questions Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)'
          },
          gap: { xs: 2, sm: 3, md: 4, lg: 5 }
        }}>
          {sortedQuestions.map((question) => (
            <Card 
              key={question._id}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                p: { xs: 2, sm: 3, md: 4 }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  gap: 2
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      flexGrow: 1,
                      fontSize: { 
                        xs: '0.9rem', 
                        sm: '1rem', 
                        md: '1.1rem',
                        lg: '1.2rem'
                      },
                      lineHeight: 1.5
                    }}
                  >
                    {question.text}
                  </Typography>
                  <Chip 
                    label={question.category} 
                    color={question.answered ? "success" : "default"}
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      minWidth: { xs: '80px', sm: '100px', md: '120px' },
                      fontSize: { 
                        xs: '0.7rem', 
                        sm: '0.8rem',
                        md: '0.9rem'
                      }
                    }}
                  />
                </Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { 
                      xs: '0.7rem', 
                      sm: '0.8rem',
                      md: '0.9rem'
                    }
                  }}
                >
                  {new Date(question.createdAt).toLocaleDateString()}
                </Typography>
                {question.answered && (
                  <Box sx={{ 
                    mt: 'auto',
                    p: { xs: 2, sm: 3, md: 4 }, 
                    bgcolor: 'grey.100', 
                    borderRadius: 1,
                    fontSize: { 
                      xs: '0.85rem', 
                      sm: '0.9rem',
                      md: '1rem',
                      lg: '1.1rem'
                    }
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      color="primary"
                      sx={{ 
                        mb: 2,
                        fontSize: { 
                          xs: '0.9rem', 
                          sm: '1rem',
                          md: '1.1rem',
                          lg: '1.2rem'
                        },
                        fontWeight: 600
                      }}
                    >
                      Answer:
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: { 
                          xs: '0.85rem', 
                          sm: '0.9rem',
                          md: '1rem',
                          lg: '1.1rem'
                        }
                      }}
                    >
                      {question.answer}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionBoard; 