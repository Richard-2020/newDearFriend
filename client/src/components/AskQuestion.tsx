import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { categories } from '../utils/categories';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AskQuestion: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !category.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          text: question.trim(),
          category: category.trim(),
        }),
      });
      if (response.ok) {
        navigate('/board');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  useEffect(() => {
    console.log('🔍 API_BASE_URL:', API_BASE_URL);
    console.log('🔍 Should be ngrok URL, not localhost!');
    setFadeIn(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Fade in={fadeIn} timeout={600}>
          <Box>
            {/* Header */}
            <Box
              sx={{
                mb: { xs: 4, sm: 6 },
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/board')}
                sx={{
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Back
              </Button>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  flexGrow: 1,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ask a Question
              </Typography>
            </Box>

            {/* Form Card */}
            <Card
              sx={{
                p: { xs: 4, sm: 5, md: 6 },
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={handleCategoryChange}
                      required
                      sx={{
                        borderRadius: 3,
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Your Question"
                    multiline
                    rows={8}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    fullWidth
                    required
                    placeholder="Type your question here..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        fontSize: '1.125rem',
                        '& textarea': {
                          minHeight: '120px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '1rem',
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'flex-end',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/board')}
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
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!question.trim() || !category || isSubmitting}
                      endIcon={<SendIcon />}
                      sx={{
                        borderRadius: 3,
                        minWidth: '140px',
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AskQuestion;
