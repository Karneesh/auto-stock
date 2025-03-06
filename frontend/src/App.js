import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import InventoryList from './pages/InventoryList';
import LowStock from './pages/LowStock';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { authService } from './utils/api';
import './App.css';

// Create a premium dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0080c0', // Hyundai blue
    },
    secondary: {
      main: '#ff6b00', // Hyundai orange
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Hyundai Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<EmployeeDashboard />} />
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Box sx={{ display: 'flex' }}>
                <Navbar />
                <Sidebar />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    ml: { sm: 8 },
                    width: { sm: `calc(100% - 240px)` },
                  }}
                >
                  <Routes>
                    <Route path="/" element={<EmployeeDashboard />} />
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/low-stock" element={<LowStock />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/employee" element={<EmployeeDashboard />} />
                  </Routes>
                </Box>
              </Box>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;