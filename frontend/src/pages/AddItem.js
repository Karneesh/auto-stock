import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  Divider,
  Alert,
  Snackbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  'Engine Parts',
  'Body Parts',
  'Electronics',
  'Interior',
  'Accessories'
];

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    model: '',
    partNumber: '',
    price: '',
    quantity: '',
    reorderLevel: '10',
    description: '',
    location: '',
    supplier: '',
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.partNumber.trim()) newErrors.partNumber = 'Part number is required';
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number';
    }
    
    if (!formData.reorderLevel) {
      newErrors.reorderLevel = 'Reorder level is required';
    } else if (isNaN(formData.reorderLevel) || Number(formData.reorderLevel) < 0) {
      newErrors.reorderLevel = 'Reorder level must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel)
      };
      
      // Replace with your actual API endpoint
      const response = await axios.post('/api/inventory/items', formattedData);
      
      setSuccessAlert(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/inventory');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding item:', error);
      
      // Handle different types of errors
      if (error.response && error.response.data && error.response.data.errors) {
        // Server validation errors
        setErrors(error.response.data.errors);
      } else {
        // General error
        setErrors({ general: 'Failed to add item. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/inventory');
  };
  
  const handleCloseAlert = () => {
    setSuccessAlert(false);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New Inventory Item
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={!!errors.category}
                helperText={errors.category}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={!!errors.model}
                helperText={errors.model}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Part Number"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                error={!!errors.partNumber}
                helperText={errors.partNumber}
                required
              />
            </Grid>
            
            {/* Inventory Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Inventory Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price ($)"
                name="price"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Reorder Level"
                name="reorderLevel"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.reorderLevel}
                onChange={handleChange}
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                error={!!errors.supplier}
                helperText={errors.supplier}
              />
            </Grid>
            
            {/* Additional Info */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Additional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                error={!!errors.imageUrl}
                helperText={errors.imageUrl}
              />
            </Grid>
            
            {/* Action Buttons */}
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleCancel}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
            </Grid>
          </Grid>
        </form>
        
        <Snackbar 
          open={successAlert} 
          autoHideDuration={6000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            Item added successfully! Redirecting to inventory...
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AddItem;
    