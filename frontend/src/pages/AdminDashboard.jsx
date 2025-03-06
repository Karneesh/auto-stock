import React, { useState } from 'react';
import { Button, Container, Typography, Paper, Input, Alert } from '@mui/material';
import api from '../utils/api';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/inventory/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message || 'File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setError(
        error.response?.data?.message || 
        'Upload failed. Make sure you are an admin and the file format is correct.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Typography variant="body1" gutterBottom>Upload Inventory CSV File</Typography>
        
        {error && <Alert severity="error" style={{ marginBottom: '10px' }}>{error}</Alert>}
        {message && <Alert severity="success" style={{ marginBottom: '10px' }}>{message}</Alert>}
        
        <Input type="file" onChange={handleFileChange} />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleUpload} 
          style={{ marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;