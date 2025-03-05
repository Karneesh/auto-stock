const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const multer = require('multer');
const csv = require('csvtojson');
const path = require('path');
const fs = require('fs').promises;

// Multer configuration for file upload (for admin backend use only)
const upload = multer({ 
  dest: 'uploads/temp/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  }
});

// Backend-only route for importing inventory
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert CSV to JSON
    const inventoryItems = await csv().fromFile(req.file.path);

    // Validate and convert Stock Qty to number
    const processedItems = inventoryItems.map(item => ({
      ...item,
      'Stock Qty': parseFloat(item['Stock Qty']) || 0
    }));

    // Clear existing data and insert new
    await Inventory.deleteMany({});
    const result = await Inventory.insertMany(processedItems);

    // Remove temporary file
    await fs.unlink(req.file.path);

    res.status(201).json({ 
      message: 'Inventory imported successfully', 
      count: result.length 
    });
  } catch (error) {
    // Ensure temporary file is removed even if there's an error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    res.status(500).json({ 
      message: 'Error importing inventory', 
      error: error.message 
    });
  }
});

// Read-only route for getting inventory
router.get('/', async (req, res) => {
  try {
    const { location, bin, material } = req.query;
    
    let searchConditions = {};
    
    if (location) {
      searchConditions['Storage Location'] = location;
    }
    
    if (bin) {
      searchConditions['Storage Bin'] = bin;
    }
    
    if (material) {
      searchConditions['Material'] = { $regex: material, $options: 'i' };
    }

    const inventory = await Inventory.find(searchConditions);
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving inventory', 
      error: error.message 
    });
  }
});

module.exports = router;