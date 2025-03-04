import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Navigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import InventoryList from './pages/InventoryList';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import ItemDetails from './pages/ItemDetails';
import LowStock from './pages/LowStock';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { Box } from '@mui/material';

// Create a premium dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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
              <Route path="/" element={<Navigate to="/employee/login" replace />} />
              <Route path="/employee/login" element={<EmployeeLogin />} />
              <Route path="/employee/dashboard" element={<EmployeeDashboard/>} />
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/add" element={<AddItem />} />
              <Route path="/inventory/edit/:id" element={<EditItem />} />
              <Route path="/inventory/:id" element={<ItemDetails />} />
              <Route path="/low-stock" element={<LowStock />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
