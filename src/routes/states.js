const express = require('express');
const router = express.Router();
const State = require('../models/State');

/**
 * @route   GET /api/states
 * @desc    Get all states with MGNREGA data
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const states = await State.find()
      .select('name code districts')
      .sort({ name: 1 });

    if (!states || states.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No states found',
      });
    }

    res.json({
      success: true,
      count: states.length,
      data: states,
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching states',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/states/:code
 * @desc    Get specific state by code
 * @access  Public
 */
router.get('/:code', async (req, res) => {
  try {
    const state = await State.findOne({ code: req.params.code });

    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    res.json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching state',
      error: error.message,
    });
  }
});

module.exports = router;
