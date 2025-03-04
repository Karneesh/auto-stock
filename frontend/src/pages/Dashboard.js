import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import InventoryChart from '../components/InventoryChart';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '50%',
  backgroundColor: theme.palette[color].main,
  color: theme.palette.common.white,
}));

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    categories: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, lowStockRes] = await Promise.all([
          axios.get('/api/inventory'),
          axios.get('/api/inventory/status/low-stock')
        ]);
        
        const items = itemsRes.data;
        const lowStockItems = lowStockRes.data;
        
        // Calculate total inventory value
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Group by category
        const categoryMap = items.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = 0;
          }
          acc[item.category] += item.quantity;
          return acc;
        }, {});
        
        const categories = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
        
        setStats({
          totalItems: items.length,
          lowStockItems: lowStockItems.length,
          totalValue,
          categories
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <IconWrapper color="primary">
                  <InventoryIcon />
                </IconWrapper>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="h4">{stats.totalItems}</Typography>
              <Typography variant="body2" color="text.secondary">Total Inventory Items</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <IconWrapper color="error">
                  <WarningIcon />
                </IconWrapper>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="h4">{stats.lowStockItems}</Typography>
              <Typography variant="body2" color="text.secondary">Low Stock Items</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <IconWrapper color="success">
                  <AttachMoneyIcon />
                </IconWrapper>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="h4">${stats.totalValue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Total Inventory Value</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <IconWrapper color="info">
                  <LocalShippingIcon />
                </IconWrapper>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="h4">24</Typography>
              <Typography variant="body2" color="text.secondary">Pending Orders</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              height: 400, 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <Typography variant="h6" gutterBottom>Inventory Overview</Typography>
            <Box sx={{ flex: 1 }}>
              <InventoryChart data={stats.categories} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Category Distribution</Typography>
            <Box sx={{ height: 330, mt: 2 }}>
              {/* Placeholder for pie chart */}
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 10 }}>
                Category distribution chart will be implemented here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;