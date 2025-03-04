import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Box, 
  Link, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText 
} from '@mui/material';
import './Login.css'; 

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced client-side validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/employees/login', {
        email,
        password
      });
      
      // More secure token storage (consider using httpOnly cookies in production)
      sessionStorage.setItem('token', res.data.token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Redirect to dashboard or employee home page
      navigate('/employee/dashboard');
    } catch (err) {
      // More generic error message for security
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement password reset logic or navigation
    navigate('/forgot-password');
  };

  const handleContactAdmin = () => {
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Employee Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ 
                mb: 2, 
                p: 1, 
                bgcolor: 'error.light', 
                color: 'error.contrastText',
                borderRadius: 1 
              }}
            >
              {error}
            </Typography>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
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
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </Link>
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleContactAdmin}
            >
              Need an Account?
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Contact Admin Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={handleCloseContactDialog}
        aria-labelledby="contact-admin-dialog-title"
      >
        <DialogTitle id="contact-admin-dialog-title">
          Need an Account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To get an account or resolve login issues, please contact your IT administrator:
            <br />
            Email: admin@company.com
            <br />
            Phone: (555) 123-4567
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default EmployeeLogin;