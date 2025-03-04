import { useState, useEffect } from 'react';
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
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WarningIcon from '@mui/icons-material/Warning';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const LowStock = () => {
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reordering, setReordering] = useState({});

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/inventory/low-stock');
      setLowStockItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching low stock items:', err);
      setError('Failed to load low stock items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (itemId) => {
    navigate(`/inventory/items/${itemId}`);
  };

  const handleAddStock = (itemId) => {
    navigate(`/inventory/restock/${itemId}`);
  };

  const handleReorder = async (itemId) => {
    setReordering(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/inventory/reorder/${itemId}`);
      
      // Update the item status in the local state
      setLowStockItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, reorderStatus: 'ordered' } 
            : item
        )
      );
    } catch (err) {
      console.error('Error reordering item:', err);
      setError('Failed to place reorder. Please try again.');
    } finally {
      setReordering(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleAddNew = () => {
    navigate('/inventory/add');
  };

  const getStatusChip = (item) => {
    const { quantity, reorderLevel, reorderStatus } = item;
    
    if (quantity === 0) {
      return <Chip 
        label="Out of Stock" 
        color="error" 
        size="small" 
        icon={<WarningIcon />} 
      />;
    }
    
    if (reorderStatus === 'ordered') {
      return <Chip 
        label="Reordered" 
        color="info" 
        size="small" 
      />;
    }
    
    const percentage = (quantity / reorderLevel) * 100;
    
    if (percentage <= 25) {
      return <Chip 
        label="Critical" 
        color="error" 
        size="small" 
      />;
    }
    
    return <Chip 
      label="Low" 
      color="warning" 
      size="small" 
    />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Low Stock Items
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddNew}
          >
            Add New Item
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : lowStockItems.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No low stock items found. All inventory levels are sufficient.
          </Alert>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Part Number</TableCell>
                  <TableCell align="center">Current Stock</TableCell>
                  <TableCell align="center">Reorder Level</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.partNumber}</TableCell>
                    <TableCell align="center">
                      <Typography 
                        color={item.quantity === 0 ? 'error' : 'text.primary'}
                        fontWeight={item.quantity === 0 ? 'bold' : 'normal'}
                      >
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.reorderLevel}</TableCell>
                    <TableCell align="center">
                      {getStatusChip(item)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(item.id)}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Add Stock">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleAddStock(item.id)}
                          sx={{ ml: 1 }}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ ml: 1 }}
                        disabled={item.reorderStatus === 'ordered' || reordering[item.id]}
                        onClick={() => handleReorder(item.id)}
                      >
                        {reordering[item.id] ? (
                          <CircularProgress size={20} thickness={5} />
                        ) : item.reorderStatus === 'ordered' ? (
                          'Ordered'
                        ) : (
                          'Reorder'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default LowStock;