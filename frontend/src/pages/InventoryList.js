import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    bin: '',
    material: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/inventory', { 
        params: filters 
      });
      
      setInventory(response.data);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error('Inventory fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="inventory-view">
      <h1>Inventory</h1>
      
      <div className="filters">
        <input
          type="text"
          name="location"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="bin"
          placeholder="Filter by Bin"
          value={filters.bin}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="material"
          placeholder="Search Material"
          value={filters.material}
          onChange={handleFilterChange}
        />
        <button onClick={fetchInventory}>Apply Filters</button>
      </div>

      {isLoading && <p>Loading inventory...</p>}
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Storage Location</th>
            <th>Storage Bin</th>
            <th>Material</th>
            <th>Material Description</th>
            <th>Basic Material</th>
            <th>Stock Qty</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item['Storage Location']}</td>
              <td>{item['Storage Bin']}</td>
              <td>{item['Material']}</td>
              <td>{item['Material Description']}</td>
              <td>{item['Basic material']}</td>
              <td>{item['Stock Qty']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryView;