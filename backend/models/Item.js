const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Engine Parts', 'Body Parts', 'Electronics', 'Interior', 'Accessories']
  },
  model: {
    type: String,
    required: true
  },
  partNumber: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  description: String,
  location: String,
  supplier: String,
  imageUrl: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);