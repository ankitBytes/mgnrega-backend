const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const { query, validationResult } = require('express-validator');

/**
 * @route   GET /api/performance/:district
 * @desc    Get performance data for a specific district
 * @query   month (optional) - Format: YYYY-MM
 * @access  Public
 */
router.get(
  '/:district',
  [
    query('month')
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage('Month must be in YYYY-MM format'),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { district } = req.params;
      const { month } = req.query;

      // Build query
      const query = { districtCode: district };
      if (month) {
        query.month = month;
      }

      // Fetch performance data
      const performanceData = await Performance.find(query)
        .sort({ month: -1 })
        .limit(month ? 1 : 12); // Get specific month or last 12 months

      if (!performanceData || performanceData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No performance data found for this district',
        });
      }

      res.json({
        success: true,
        count: performanceData.length,
        district: district,
        data: performanceData,
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching performance data',
        error: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/performance/:district/trends
 * @desc    Get trend data for a district (last 12 months)
 * @access  Public
 */
router.get('/:district/trends', async (req, res) => {
  try {
    const { district } = req.params;

    const trends = await Performance.find({ districtCode: district })
      .sort({ month: -1 })
      .limit(12)
      .select('month personDays households wagesPaid pendingLiabilities');

    if (!trends || trends.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trend data found for this district',
      });
    }

    res.json({
      success: true,
      count: trends.length,
      district: district,
      data: trends.reverse(), // Oldest to newest
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trends',
      error: error.message,
    });
  }
});

module.exports = router;
