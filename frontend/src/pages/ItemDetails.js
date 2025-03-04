import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

const ItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/inventory/${id}`);
        setItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError('Failed to load item details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        navigate('/inventory');
      } catch (error) {
        console.error('Error deleting item:', error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };
  
  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity <= 0) {
      return { label: 'Out of Stock', color: 'error' };
    } else if (quantity <= reorderLevel) {
      return { label: 'Low Stock', color: 'warning' };
    } else {
      return { label: 'In Stock', color: 'success' };
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/inventory')}
        >
          Back to Inventory
        </Button>
      </Box>
    );
  }
  
  if (!item) {
    return (
      <Box sx={{ mt: 5 }}>
        <Alert severity="warning">Item not found</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/inventory')}
        >
          Back to Inventory
        </Button>
      </Box>
    );
  }
  
  const status = getStockStatus(item.quantity, item.reorderLevel);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/inventory')}
        >
          Back to Inventory
        </Button>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            onClick={() => navigate(`/inventory/edit/${id}`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              height: 300, 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}>
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    bgcolor: 'primary.main',
                    fontSize: '4rem'
                  }}
                >
                  <InventoryIcon fontSize="inherit" />
                </Avatar>
              )}
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">{item.quantity}</Typography>
                    <Typography variant="body2" color="text.secondary">In Stock</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">${item.price}</Typography>
                    <Typography variant="body2" color="text.secondary">Unit Price</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4">{item.name}</Typography>
              <Chip 
                label={status.label} 
                color={status.color} 
              />
            </Box>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Part Number: {item.partNumber}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Category" 
                      secondary={item.category} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Model" 
                      secondary={item.model} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Reorder Level" 
                      secondary={item.reorderLevel} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Location" 
                      secondary={item.location || 'Not specified'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Supplier" 
                      secondary={item.supplier || 'Not specified'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={new Date(item.updatedAt).toLocaleDateString()} 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph>
              {item.description || 'No description available.'}
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.quantity <= item.reorderLevel ? (
                    <>
                      <WarningIcon color="warning" />
                      <Typography>
                        This item is below the reorder level. Consider restocking soon.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <LocalShippingIcon color="info" />
                      <Typography>
                        This item is adequately stocked.
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <AttachMoneyIcon />
              </Avatar>
              <Typography variant="h6">Financial Information</Typography>
            </Box>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Unit Cost" 
                  secondary={`$${item.price.toFixed(2)}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total Value" 
                  secondary={`$${(item.price * item.quantity).toFixed(2)}`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <InventoryIcon />
              </Avatar>
              <Typography variant="h6">Inventory Details</Typography>
            </Box>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Current Stock" 
                  secondary={item.quantity} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Reorder When Below" 
                  secondary={item.reorderLevel} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Status" 
                  secondary={
                    <Chip 
                      label={status.label} 
                      color={status.color} 
                      size="small" 
                    />
                  } 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <StorefrontIcon />
              </Avatar>
              <Typography variant="h6">Supplier Information</Typography>
            </Box>
            {item.supplier ? (
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Supplier Name" 
                    secondary={item.supplier} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Lead Time" 
                    secondary="Information not available" 
                  />
                </ListItem>
              </List>
            ) : (
              <Typography color="text.secondary">
                No supplier information available.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetails;