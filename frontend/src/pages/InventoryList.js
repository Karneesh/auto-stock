import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { inventoryService } from '../utils/api';

function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    bin: '',
    material: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await inventoryService.getAllItems({ 
        params: filters 
      });
      
      setInventory(response.data);
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError('Failed to fetch inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Inventory</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Filter by Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Filter by Bin"
              name="bin"
              value={filters.bin}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Search Material"
              name="material"
              value={filters.material}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={fetchInventory}
              fullWidth
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Storage Location</TableCell>
                <TableCell>Storage Bin</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Material Description</TableCell>
                <TableCell>Basic Material</TableCell>
                <TableCell>Stock Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item['Storage Location']}</TableCell>
                    <TableCell>{item['Storage Bin']}</TableCell>
                    <TableCell>{item['Material']}</TableCell>
                    <TableCell>{item['Material Description']}</TableCell>
                    <TableCell>{item['Basic material']}</TableCell>
                    <TableCell>{item['Stock Qty']}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default InventoryList;