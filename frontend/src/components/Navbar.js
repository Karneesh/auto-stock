import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1e3c72, #2a5298)' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          AutoStock Dashboard
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
          <Button color="inherit" onClick={() => navigate('/employee')}>Employee</Button>
          <Button color="secondary" variant="contained" onClick={handleLogout} sx={{ ml: 2 }}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
