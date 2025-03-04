import { useState, useEffect } from 'react';
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
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const categories = [
  'Engine Parts',
  'Body Parts',
  'Electronics',
  'Interior',
  'Accessories'
];

const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    model: '',
    partNumber: '',
    price: '',
    quantity: '',
    reorderLevel: '',
    description: '',
    location: '',
    supplier: '',
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successAlert, setSuccessAlert] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/inventory/${id}`);
        const item = response.data;
        
        setFormData({
          name: item.name,
          category: item.category,
          model: item.model,
          partNumber: item.partNumber,
          price: item.price.toString(),
          quantity: item.quantity.toString(),
          reorderLevel: item.reorderLevel.toString(),
          description: item.description || '',
          location: item.location || '',
          supplier: item.supplier || '',
          imageUrl: item.imageUrl || ''
        });
        
        setFetchLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setFetchError('Failed to load item information. Please try again.');
        setFetchLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
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
      // Convert numeric fields to numbers
      const numericFormData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        reorderLevel: parseInt(formData.reorderLevel, 10)
      };
      
      await axios.put(`/api/inventory/${id}`, numericFormData);
      setSuccessAlert(true);
      setLoading(false);
      
      // Navigate back after 1 second
      setTimeout(() => {
        navigate('/inventory');
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Error updating item:', error);
      
      if (error.response && error.response.data.message) {
        if (error.response.data.message.includes('duplicate key error') && 
            error.response.data.message.includes('partNumber')) {
          setErrors({ partNumber: 'This part number already exists' });
        } else {
          setErrors({ form: 'Error updating item: ' + error.response.data.message });
        }
      } else {
        setErrors({ form: 'Error connecting to server' });
      }
    }
  };
  
  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (fetchError) {
    return (
      <Box sx={{ mt: 5 }}>
        <Alert severity="error">{fetchError}</Alert>
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
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Inventory Item
      </Typography>
      
      <Paper sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.form}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.category}
                helperText={errors.category}
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.model}
                helperText={errors.model}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Part Number"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.partNumber}
                helperText={errors.partNumber}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: 0.01 }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="Reorder Level"
                name="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Additional Information</Divider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Storage Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/inventory')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update Item'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={successAlert} 
        autoHideDuration={3000} 
        onClose={() => setSuccessAlert(false)}
      >
        <Alert severity="success">
          Item updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditItem;