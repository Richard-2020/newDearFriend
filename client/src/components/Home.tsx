import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AdminPanelIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

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
                mb: { xs: 4, sm: 5 },
                color: 'text.secondary',
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              You've got questions, we've got answers.
            </Typography>
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
                onClick={() => navigate('/board')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderRadius: 3,
                }}
              >
                View Questions
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/ask')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderRadius: 3,
                }}
              >
                Ask Questions
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Feature Card */}
        <Fade in={fadeIn} timeout={1000}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            <Card
              sx={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 20px 40px rgba(0, 102, 204, 0.15)',
                },
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 4, sm: 5, md: 6 },
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
                  <QuestionAnswerIcon
                    sx={{
                      fontSize: { xs: 48, sm: 64, md: 80 },
                      color: 'primary.main',
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  Question Board
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    lineHeight: 1.7,
                    maxWidth: '600px',
                    mx: 'auto',
                  }}
                >
                  Post your questions to our community board. Our team will review and respond to
                  your questions personally with thoughtful, detailed answers.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Home; 