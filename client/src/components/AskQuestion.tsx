import React, { useState } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { categories } from '../utils/categories';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AskQuestion: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting question with category:', category); // Debug log
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: question.trim(), 
          category: category.trim() 
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Question submitted successfully:', data); // Debug log
        navigate('/board');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    console.log('Selected category:', newCategory); // Debug log
    setCategory(newCategory);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Card>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/board')}
                size="small"
                sx={{ mr: 2 }}
              >
                Back to Board
              </Button>
              <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
                Ask a Question
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={handleCategoryChange}
                  required
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
                rows={6}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    '& textarea': {
                      minHeight: { xs: '70px', sm: '120px', md: '80px' }
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!question.trim() || !category}
              >
                Submit Question
              </Button>
            </form>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default AskQuestion; 