const express = require('express');
const router = express.Router();
const District = require('../models/District');

/**
 * @route   GET /api/districts/:state
 * @desc    Get all districts for a specific state
 * @access  Public
 */
router.get('/:state', async (req, res) => {
  try {
    const { state } = req.params;

    const districts = await District.find({ stateCode: state })
      .select('name code stateCode stateName')
      .sort({ name: 1 });

    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No districts found for state: ${state}`,
      });
    }

    res.json({
      success: true,
      count: districts.length,
      state: state,
      data: districts,
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching districts',
      error: error.message,
    });
  }
});

module.exports = router;
