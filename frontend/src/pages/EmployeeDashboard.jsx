import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const EmployeeDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/inventory') // No auth token needed
      .then((response) => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load inventory');
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Inventory Dashboard</Typography>
        {loading ? (
          <Typography variant="body1">Loading inventory...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Stock Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item['Material']}</TableCell>
                    <TableCell>{item['Material Description']}</TableCell>
                    <TableCell>{item['Stock Qty']}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default EmployeeDashboard;
