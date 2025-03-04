import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login if no token
      navigate('/login');
      return;
    }

    // Set up axios default headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch user data
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint for user data
        const response = await axios.get('/api/employees/profile');
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data');
        setLoading(false);
        
        // If unauthorized, clear token and redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={handleLogout}>Return to Login</button>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <h1>AutoStock Premium Dashboard</h1>
        <button 
          className="logout-button" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        {userData && (
          <div className="user-profile">
            <h2>Welcome, {userData.name}!</h2>
            <div className="user-details">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role || 'Employee'}</p>
              <p><strong>Department:</strong> {userData.department || 'Not Specified'}</p>
            </div>
          </div>
        )}

        <div className="dashboard-widgets">
          <div className="widget stock-overview">
            <h3>Stock Overview</h3>
            {/* Add stock-related widgets or summary */}
            <p>Your current stock portfolio summary</p>
          </div>

          <div className="widget recent-activity">
            <h3>Recent Activity</h3>
            {/* Add recent trading or account activity */}
            <p>No recent activities</p>
          </div>

          <div className="widget quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button>View Stocks</button>
              <button>Trade</button>
              <button>Account Settings</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;