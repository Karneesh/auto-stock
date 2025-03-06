const express = require('express');
const router = express.Router();
const Inventory = require('../../models/Inventory');

// Remove authentication middleware so employees can access inventory without login
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory', error: error.message });
  }
});

module.exports = router;
