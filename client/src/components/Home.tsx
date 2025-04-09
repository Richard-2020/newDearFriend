import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AdminPanelIcon from '@mui/icons-material/AdminPanelSettings';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to DearFriend
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          You've got questions, we've got answers.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AdminPanelIcon />}
          onClick={() => navigate('/login')}
          sx={{ mb: 4 }}
        >
          Admin Login
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Box sx={{ maxWidth: 600, width: '100%' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <QuestionAnswerIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Question Board
              </Typography>
              <Typography color="text.secondary" align="center">
                Post your questions to our community board. Our team will review and respond to
                your questions personally.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate('/board')}
                startIcon={<QuestionAnswerIcon />}
              >
                View Questions
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 