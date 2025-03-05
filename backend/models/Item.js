const mongoose = require('mongoose');

// Define the Inventory Schema using exact column names from the CSV
const inventorySchema = new mongoose.Schema({
  'Storage Location': {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  'Storage Bin': {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  'Material': {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  'Material Description': {
    type: String,
    required: true,
    trim: true
  },
  'Basic material': {
    type: String,
    required: true,
    trim: true
  },
  'Stock Qty': {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  // Adds createdAt and updatedAt timestamps
  timestamps: true,
  
  // Customize the collection name
  collection: 'inventory'
});

// Create composite index for faster querying
inventorySchema.index({ 'Storage Location': 1, 'Storage Bin': 1 });

// Create and export the model
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;