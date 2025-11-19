import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Fade,
  CircularProgress,
} from '@mui/material';
import AdminPanelIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in memory (not localStorage for better security)
        // The token is also stored in httpOnly cookie by the server
        if (data.token) {
          // Store token in sessionStorage (more secure than localStorage)
          // In production, consider using httpOnly cookies only
          sessionStorage.setItem('authToken', data.token);
        }
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Fade in={fadeIn} timeout={600}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                mb: 4,
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Back to Home
            </Button>

            <Card
              sx={{
                p: { xs: 4, sm: 5, md: 6 },
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
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
                    <AdminPanelIcon
                      sx={{
                        fontSize: { xs: 48, sm: 64 },
                        color: 'primary.main',
                      }}
                    />
                  </Box>
                  <Typography
                    component="h1"
                    variant="h3"
                    sx={{
                      mb: 1,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Admin Login
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Sign in to access the admin panel
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                      }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  )}

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.125rem',
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
