import React, { useState } from 'react';
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
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const AskQuestion: React.FC = () => {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: question }),
      });

      if (response.ok) {
        navigate('/board');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Ask a Question
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/board')}
            sx={{ ml: 2 }}
          >
            Back to Board
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <QuestionAnswerIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                required
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/board')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<QuestionAnswerIcon />}
                >
                  Submit Question
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AskQuestion; 